import {
  window,
  workspace,
  extensions,
  commands,
  ExtensionContext,
  FileSystemWatcher,
  WorkspaceConfiguration
} from 'vscode'

const TS_EXT_ID = 'vscode.typescript-language-features'
const ESLINT_EXT_ID = 'dbaeumer.vscode-eslint'
const THIS_EXT_NAME = 'vscode-auto-restart-typescript-eslint-servers'
const THIS_EXT_ID = `neotan.${THIS_EXT_NAME}`

const TS_SERVER_RESTARTED_MSG = `TypeScript Server Restarted as file(s) `
const TS_SERVER_RESTART_FAILED_MSG =
  `TypeScript Server Restart failed when the file `
const ESLINT_SERVER_RESTARTED_MSG = `ESLint Server Restarted as file(s) `
const ESLINT_SERVER_RESTART_FAILED_MSG =
  `ESLint Server Restart failed when the file was `

let tsWatcher: FileSystemWatcher
let eslintWatcher: FileSystemWatcher

export function activate(context: ExtensionContext) {
  const wsConfig = workspace.getConfiguration('autoRestartTsESLint')
  console.warn(wsConfig)

  if (wsConfig.monitorFilesForTypescript) {
    tsWatcher = initWatcherForTypescriptFiles(wsConfig)
  }

  if (wsConfig.monitorFilesForESLint) {
    eslintWatcher = initWatcherForEslintFiles(wsConfig)
  }

  console.log(
    `Extension ${THIS_EXT_ID} is now active!`,
    JSON.stringify(wsConfig, [
      'monitorFilesForTypescript',
      'monitorFilesForESLint',
      'includeFilesForTypescript',
      'includeFilesForESLint',
    ], 2))

  context.subscriptions.push(
    commands
      .registerCommand(`${THIS_EXT_NAME}.enableMonitorFilesForTypescript`,
        async () => {
          await wsConfig.update('monitorFilesForTypescript', true)
          tsWatcher = initWatcherForTypescriptFiles(wsConfig)
        }),
    commands
      .registerCommand(`${THIS_EXT_NAME}.disableMonitorFilesForTypescript`,
        async () => {
          await wsConfig.update('monitorFilesForTypescript', false)
          tsWatcher?.dispose()
        }),
    commands
      .registerCommand(`${THIS_EXT_NAME}.enableMonitorFilesForESLint`,
        async () => {
          await wsConfig.update('monitorFilesForESLint', true)
          eslintWatcher = initWatcherForEslintFiles(wsConfig)
        }),
    commands
      .registerCommand(`${THIS_EXT_NAME}.disableMonitorFilesForESLint`,
        async () => {
          await wsConfig.update('monitorFilesForESLint', false)
          eslintWatcher?.dispose()
        }),
  )
}

export function deactivate() {
  tsWatcher?.dispose()
  eslintWatcher?.dispose()
  console.log(`Extension ${THIS_EXT_ID} is now deactive!`)
}

// ===== Utils =====

function restartTsServer() {
  const tsExtension = extensions.getExtension(TS_EXT_ID)
  if (!tsExtension || tsExtension.isActive === false) {
    window.showErrorMessage(`${THIS_EXT_NAME} is not active or not running.`)
    return
  }

  return commands.executeCommand("typescript.restartTsServer")
}

function restartEslintServer() {
  const eslintExtension = extensions.getExtension(ESLINT_EXT_ID)
  if (!eslintExtension || eslintExtension.isActive === false) {
    window.showErrorMessage("ESLint extension is not active or not running.")
    return
  }

  return commands.executeCommand("eslint.restart")
}

function initWatcherForTypescriptFiles(wsConfig: WorkspaceConfiguration) {
  const tsWatcher: FileSystemWatcher =
    workspace.createFileSystemWatcher(
      wsConfig.includeFilesForTypescript,
      false,
      false,
      false
    )

  tsWatcher.onDidCreate(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartTsServer()
      window.showInformationMessage(
        `${TS_SERVER_RESTARTED_MSG} was created: ${filePath}`
      )
    } catch (err) {
      throw new Error(
        `${TS_SERVER_RESTART_FAILED_MSG} was created: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  tsWatcher.onDidChange(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartTsServer()
      window.showInformationMessage(
        `${TS_SERVER_RESTARTED_MSG} was changed: ${filePath}`
      )
    } catch (err) {
      throw new Error(
        `${TS_SERVER_RESTART_FAILED_MSG} was changed: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  tsWatcher.onDidDelete(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartTsServer()
      window.showInformationMessage(
        `${TS_SERVER_RESTARTED_MSG} was deleted: ${filePath}`
      )
    } catch (err) {
      throw new Error(
        `${TS_SERVER_RESTART_FAILED_MSG} was deleted: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  return tsWatcher
}

function initWatcherForEslintFiles(wsConfig: WorkspaceConfiguration) {
  const eslintWatcher: FileSystemWatcher =
    workspace.createFileSystemWatcher(
      wsConfig.includeFilesForESLint,
      false,
      false,
      false
    )

  eslintWatcher.onDidCreate(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartEslintServer()
      window.showInformationMessage(
        `${ESLINT_SERVER_RESTARTED_MSG} was created: ${filePath}`
      )
    } catch (err) {
      throw new Error(
        `${ESLINT_SERVER_RESTART_FAILED_MSG} was Created: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  eslintWatcher.onDidChange(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartEslintServer()
      window.showInformationMessage(
        `${ESLINT_SERVER_RESTARTED_MSG} was changed: ${filePath}`
      )
    } catch (err) {
      throw new Error(
        `${ESLINT_SERVER_RESTART_FAILED_MSG} was changed: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  eslintWatcher.onDidDelete(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartEslintServer()
      window.showInformationMessage(
        `${ESLINT_SERVER_RESTARTED_MSG} was deleted: ${filePath}`
      )
    } catch (err) {
      throw new Error(
        `${ESLINT_SERVER_RESTART_FAILED_MSG} was deleted: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  return eslintWatcher
}
