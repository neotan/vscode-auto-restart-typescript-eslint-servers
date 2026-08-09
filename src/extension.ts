import {
  commands,
  Disposable,
  Extension,
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
  monitorFilesForStylelint: boolean
  monitorFilesForRemark: boolean
  monitorFilesForAstro: boolean
  fileGlobForTypescript: GlobPattern | GlobPattern[]
  fileGlobForESLint: GlobPattern | GlobPattern[]
  fileGlobForStylelint: GlobPattern | GlobPattern[]
  fileGlobForRemark: GlobPattern | GlobPattern[]
  fileGlobForAstro: GlobPattern | GlobPattern[]
  showRestartNotificationForTypescript: boolean
  showRestartNotificationForESLint: boolean
  showRestartNotificationForStylelint: boolean
  showRestartNotificationForRemark: boolean
  showRestartNotificationForAstro: boolean
  debounceDelayMs: number
  excludePatterns: string[]
}

type AstroLanguageClient = {
  restart: () => Thenable<void>
}

type AstroExtensionExports = {
  volarLabs?: {
    languageClients?: AstroLanguageClient[]
  }
}

const TS_EXT_ID = 'vscode.typescript-language-features'
const ESLINT_EXT_ID = 'dbaeumer.vscode-eslint'
const STYLELINT_EXT_ID = 'stylelint.vscode-stylelint'
const REMARK_EXT_ID = 'unifiedjs.vscode-remark'
const ASTRO_EXT_ID = 'astro-build.astro-vscode'
const THIS_EXT_NAME = 'vscode-auto-restart-typescript-eslint-servers'
const THIS_EXT_ID = `neotan.${THIS_EXT_NAME}`
const THIS_EXT_CONFIG_PREFIX = `autoRestart` // i.e. Configuration `section`

let tsWatcher: Disposable
let eslintWatcher: Disposable
let stylelintWatcher: Disposable
let remarkWatcher: Disposable
let astroWatcher: Disposable

export function activate(context: ExtensionContext) {
  workspace.onDidChangeConfiguration((e) => {

    // Re-initiate the watchers might be overkill when any configuration 
    // changed, but it's the easiest way to make sure the watchers are 
    // up-to-date with the latest configuration.
    if (e.affectsConfiguration(THIS_EXT_CONFIG_PREFIX)) {
      tsWatcher?.dispose()
      eslintWatcher?.dispose()
      stylelintWatcher?.dispose()
      remarkWatcher?.dispose()
      astroWatcher?.dispose()

      if (getConfig('monitorFilesForTypescript')) {
        tsWatcher = initWatcher('Typescript', restartTsServer)
      }

      if (getConfig('monitorFilesForESLint')) {
        eslintWatcher = initWatcher('ESLint', restartEslintServer)
      }

      if (getConfig('monitorFilesForStylelint')) {
        stylelintWatcher = initWatcher('Stylelint', restartStylelintServer)
      }

      if (getConfig('monitorFilesForRemark')) {
        remarkWatcher = initWatcher('Remark', restartRemarkServer)
      }

      if (getConfig('monitorFilesForAstro')) {
        astroWatcher = initWatcher('Astro', restartAstroServer)
      }
    }
  })

  if (getConfig('monitorFilesForTypescript')) {
    tsWatcher = initWatcher('Typescript', restartTsServer)
  }

  if (getConfig('monitorFilesForESLint')) {
    eslintWatcher = initWatcher('ESLint', restartEslintServer)
  }

  if (getConfig('monitorFilesForStylelint')) {
    stylelintWatcher = initWatcher('Stylelint', restartStylelintServer)
  }

  if (getConfig('monitorFilesForRemark')) {
    remarkWatcher = initWatcher('Remark', restartRemarkServer)
  }

  if (getConfig('monitorFilesForAstro')) {
    astroWatcher = initWatcher('Astro', restartAstroServer)
  }
}

export function deactivate() {
  tsWatcher?.dispose()
  eslintWatcher?.dispose()
  stylelintWatcher?.dispose()
  remarkWatcher?.dispose()
  astroWatcher?.dispose()
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

function getActiveExtension<T>(
  extensionId: string,
  extensionName: string
): Extension<T> | undefined {
  const extension = extensions.getExtension<T>(extensionId)
  if (!extension || extension.isActive === false) {
    window.showErrorMessage(
      `${extensionName} extension is not active or not running.`
    )
    return undefined
  }

  return extension
}

async function restartTsServer(): Promise<boolean> {
  if (!getActiveExtension(TS_EXT_ID, 'TypeScript')) {
    return false
  }

  await commands.executeCommand('typescript.restartTsServer')
  return true
}

async function restartEslintServer(): Promise<boolean> {
  if (!getActiveExtension(ESLINT_EXT_ID, 'ESLint')) {
    return false
  }

  await commands.executeCommand('eslint.restart')
  return true
}

async function restartStylelintServer(): Promise<boolean> {
  if (!getActiveExtension(STYLELINT_EXT_ID, 'Stylelint')) {
    return false
  }

  await commands.executeCommand('stylelint.restart')
  return true
}

async function restartRemarkServer(): Promise<boolean> {
  if (!getActiveExtension(REMARK_EXT_ID, 'Remark')) {
    return false
  }

  await commands.executeCommand('remark.restart')
  return true
}

async function restartAstroServer(): Promise<boolean> {
  const astroExtension = getActiveExtension<AstroExtensionExports>(
    ASTRO_EXT_ID,
    'Astro'
  )
  if (!astroExtension) {
    return false
  }

  const languageClients = astroExtension.exports.volarLabs?.languageClients
  if (!languageClients?.length) {
    window.showErrorMessage(
      'Astro extension does not expose an active language server.'
    )
    return false
  }

  await Promise.all(languageClients.map(client => client.restart()))
  return true
}

function initWatcher(
  serverType: 'Typescript' | 'ESLint' | 'Stylelint' | 'Remark' | 'Astro',
  cb: () => Thenable<boolean>
): Disposable {
  let globs = getConfig(`fileGlobFor${serverType}`)
  // Compatibility with older configuration format
  if (!Array.isArray(globs)) {
    globs = [globs]
  }

  // Debounced handler shared across all globs and event types for this server
  const debouncedRestart = debounce(async (filePath: string, type: string) => {
    try {
      const restarted = await cb()
      if (!restarted) {
        return
      }
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
