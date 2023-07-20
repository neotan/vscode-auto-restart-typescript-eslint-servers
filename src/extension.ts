import {
  window,
  workspace,
  extensions,
  commands,
  ExtensionContext,
  FileSystemWatcher,
  GlobPattern,
} from 'vscode'

type ConfigProperties = {
  monitorFilesForTypescript: boolean
  monitorFilesForESLint: boolean
  fileGlobForTypescript: GlobPattern
  fileGlobForESLint: GlobPattern
  showRestartNotificationForTypescript: boolean
  showRestartNotificationForESLint: boolean
}

const TS_EXT_ID = 'vscode.typescript-language-features'
const ESLINT_EXT_ID = 'dbaeumer.vscode-eslint'
const THIS_EXT_NAME = 'vscode-auto-restart-typescript-eslint-servers'
const THIS_EXT_ID = `neotan.${THIS_EXT_NAME}`
const THIS_EXT_CONFIG_PREFIX = `autoRestart` // i.e. Configuration `section`

// Message templates
const TS_SERVER_RESTARTED_MSG = `TypeScript Server Restarted as file(s) `
const TS_SERVER_RESTART_FAILED_MSG =
  `TypeScript Server Restart failed when the file `
const ESLINT_SERVER_RESTARTED_MSG = `ESLint Server Restarted as file(s) `
const ESLINT_SERVER_RESTART_FAILED_MSG =
  `ESLint Server Restart failed when the file was `

let tsWatcher: FileSystemWatcher
let eslintWatcher: FileSystemWatcher

export function activate(context: ExtensionContext) {
  workspace.onDidChangeConfiguration((e) => {

    // Re-initiate the watchers might be overkill when any configuration 
    // changed, but it's the easiest way to make sure the watchers are 
    // up-to-date with the latest configuration.
    if (e.affectsConfiguration(THIS_EXT_CONFIG_PREFIX)) {
      tsWatcher?.dispose()
      eslintWatcher?.dispose()

      if (getConfig('monitorFilesForTypescript')) {
        tsWatcher = initWatcherForTypescript()
      }

      if (getConfig('monitorFilesForESLint')) {
        eslintWatcher = initWatcherForEslint()
      }
    }
  })

  if (getConfig('monitorFilesForTypescript')) {
    tsWatcher = initWatcherForTypescript()
  }

  if (getConfig('monitorFilesForESLint')) {
    eslintWatcher = initWatcherForEslint()
  }
}

export function deactivate() {
  tsWatcher?.dispose()
  eslintWatcher?.dispose()
  console.log(`Extension ${THIS_EXT_ID} is now deactivated!`)
}

// ===== Utils =====

function getConfig<K extends keyof ConfigProperties>(
  property: K): ConfigProperties[K] {
  return workspace.getConfiguration(THIS_EXT_CONFIG_PREFIX).get(property)!
}

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

function initWatcherForTypescript(
  fileGlobForTypescript: GlobPattern = getConfig('fileGlobForTypescript')
) {
  const tsWatcher: FileSystemWatcher =
    workspace.createFileSystemWatcher(
      fileGlobForTypescript,
      false,
      false,
      false
    )

  tsWatcher.onDidCreate(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartTsServer()
      if (getConfig('showRestartNotificationForTypescript')) {
        window.showInformationMessage(
          `${TS_SERVER_RESTARTED_MSG} created: ${filePath}`
        )
      }
    } catch (err) {
      throw new Error(
        `${TS_SERVER_RESTART_FAILED_MSG} created: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  tsWatcher.onDidChange(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartTsServer()
      if (getConfig('showRestartNotificationForTypescript')) {
        window.showInformationMessage(
          `${TS_SERVER_RESTARTED_MSG} changed: ${filePath}`
        )
      }
    } catch (err) {
      throw new Error(
        `${TS_SERVER_RESTART_FAILED_MSG} changed: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  tsWatcher.onDidDelete(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartTsServer()
      if (getConfig('showRestartNotificationForTypescript')) {
        window.showInformationMessage(
          `${TS_SERVER_RESTARTED_MSG} deleted: ${filePath}`
        )
      }
    } catch (err) {
      throw new Error(
        `${TS_SERVER_RESTART_FAILED_MSG} deleted: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  return tsWatcher
}

function initWatcherForEslint(
  fileGlobForESLint: GlobPattern = getConfig('fileGlobForESLint')
) {
  const eslintWatcher: FileSystemWatcher =
    workspace.createFileSystemWatcher(
      fileGlobForESLint,
      false,
      false,
      false
    )

  eslintWatcher.onDidCreate(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartEslintServer()
      if (getConfig('showRestartNotificationForESLint')) {
        window.showInformationMessage(
          `${ESLINT_SERVER_RESTARTED_MSG} created: ${filePath}`
        )
      }
    } catch (err) {
      throw new Error(
        `${ESLINT_SERVER_RESTART_FAILED_MSG} created: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  eslintWatcher.onDidChange(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartEslintServer()
      if (getConfig('showRestartNotificationForESLint')) {
        window.showInformationMessage(
          `${ESLINT_SERVER_RESTARTED_MSG} changed: ${filePath}`
        )
      }
    } catch (err) {
      throw new Error(
        `${ESLINT_SERVER_RESTART_FAILED_MSG} changed: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  eslintWatcher.onDidDelete(async (e) => {
    const filePath = e?.path || e?.fsPath
    try {
      await restartEslintServer()
      if (getConfig('showRestartNotificationForESLint')) {
        window.showInformationMessage(
          `${ESLINT_SERVER_RESTARTED_MSG} deleted: ${filePath}`
        )
      }
    } catch (err) {
      throw new Error(
        `${ESLINT_SERVER_RESTART_FAILED_MSG} deleted: 
          "${filePath}"`,
        { cause: err }
      )
    }
  })

  return eslintWatcher
}
