import {
  commands,
  Disposable,
  ExtensionContext,
  extensions,
  GlobPattern,
  Uri,
  window,
  workspace,
} from 'vscode'

type ConfigProperties = {
  monitorFilesForTypescript: boolean
  monitorFilesForESLint: boolean
  fileGlobForTypescript: GlobPattern | GlobPattern[]
  fileGlobForESLint: GlobPattern | GlobPattern[]
  showRestartNotificationForTypescript: boolean
  showRestartNotificationForESLint: boolean
  debounceDelayMs: number
  excludePatterns: string[]
}

const TS_EXT_ID = 'vscode.typescript-language-features'
const ESLINT_EXT_ID = 'dbaeumer.vscode-eslint'
const THIS_EXT_NAME = 'vscode-auto-restart-typescript-eslint-servers'
const THIS_EXT_ID = `neotan.${THIS_EXT_NAME}`
const THIS_EXT_CONFIG_PREFIX = `autoRestart` // i.e. Configuration `section`

let tsWatcher: Disposable
let eslintWatcher: Disposable

export function activate(context: ExtensionContext) {
  workspace.onDidChangeConfiguration((e) => {

    // Re-initiate the watchers might be overkill when any configuration 
    // changed, but it's the easiest way to make sure the watchers are 
    // up-to-date with the latest configuration.
    if (e.affectsConfiguration(THIS_EXT_CONFIG_PREFIX)) {
      tsWatcher?.dispose()
      eslintWatcher?.dispose()

      if (getConfig('monitorFilesForTypescript')) {
        tsWatcher = initWatcher('Typescript', restartTsServer)
      }

      if (getConfig('monitorFilesForESLint')) {
        eslintWatcher = initWatcher('ESLint', restartEslintServer)
      }
    }
  })

  if (getConfig('monitorFilesForTypescript')) {
    tsWatcher = initWatcher('Typescript', restartTsServer)
  }

  if (getConfig('monitorFilesForESLint')) {
    eslintWatcher = initWatcher('ESLint', restartEslintServer)
  }
}

export function deactivate() {
  tsWatcher?.dispose()
  eslintWatcher?.dispose()
  console.log(`Extension ${THIS_EXT_ID} is now deactivated!`)
}

// ===== Utils =====

function debounce<Args extends unknown[]>(
  fn: (...args: Args) => unknown,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

function getConfig<K extends keyof ConfigProperties>(
  property: K): ConfigProperties[K] {
  return workspace.getConfiguration(THIS_EXT_CONFIG_PREFIX).get(property)!
}

function isExcluded(filePath: string): boolean {
  const excludePatterns = getConfig('excludePatterns')
  // Normalize path separators for cross-platform matching
  const normalizedPath = filePath.replace(/\\/g, '/')

  return excludePatterns.some(pattern => {
    // Convert glob pattern to a simple substring check
    // e.g., "**/node_modules/**" -> "/node_modules/"
    const segment = pattern
      .replace(/^\*\*\//, '')  // Remove leading **/
      .replace(/\/\*\*$/, '')  // Remove trailing /**
    return normalizedPath.includes(`/${segment}/`)
  })
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

function initWatcher(
  serverType: 'Typescript' | 'ESLint',
  cb: () => Thenable<unknown> | void
): Disposable {
  let globs = getConfig(`fileGlobFor${serverType}`)
  // Compatibility with older configuration format
  if (!Array.isArray(globs)) {
    globs = [globs]
  }

  // Debounced handler shared across all globs and event types for this server
  const debouncedRestart = debounce(async (filePath: string, type: string) => {
    try {
      await cb()
      if (getConfig(`showRestartNotificationFor${serverType}`)) {
        window.showInformationMessage(
          `${serverType} Server Restarted as file(s) ${type}: ${filePath}`
        )
      }
    } catch (err) {
      throw new Error(
        `Failed to restart server when the file "${filePath}" was ${type}`,
        { cause: err }
      )
    }
  }, getConfig('debounceDelayMs'))

  function createEventHandler(type: string) {
    return (e: Uri) => {
      const filePath = e.path || e.fsPath
      if (isExcluded(filePath)) {
        return
      }
      debouncedRestart(filePath, type)
    }
  }

  const watchers = globs.map(glob => {
    const watcher = workspace.createFileSystemWatcher(glob, false, false, false)
    watcher.onDidCreate(createEventHandler('created'))
    watcher.onDidChange(createEventHandler('changed'))
    watcher.onDidDelete(createEventHandler('deleted'))
    return watcher
  })

  return Disposable.from(...watchers)
}
