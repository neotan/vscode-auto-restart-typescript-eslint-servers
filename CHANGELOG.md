### 0.0.8 (2026-01-22)
* Add debounce for file watcher events to batch rapid consecutive changes (e.g., from `npm install`)
  * Configurable via `autoRestart.debounceDelayMs` (default: 500ms)
* Add exclude patterns to filter out unwanted directories from monitoring
  * Configurable via `autoRestart.excludePatterns` (default: `**/node_modules/**`, `**/.dist/**`)

### 0.0.6 (2024-09-03)
* Add development guidelines ([#12](https://github.com/neotan/vscode-auto-restart-typescript-eslint-servers/pull/12))
* Support multiple globs in config ([#11](https://github.com/neotan/vscode-auto-restart-typescript-eslint-servers/pull/11)) - Thanks to [@j4k0xb](https://github.com/j4k0xb)

### 0.0.5 (2023-07-20)
* Add notification toggles when server restart ([#1](https://github.com/neotan/vscode-auto-restart-typescript-eslint-servers/issues/1) & [#5](https://github.com/neotan/vscode-auto-restart-typescript-eslint-servers/issues/5))
* Fix files monitoring bug ([#6](https://github.com/neotan/vscode-auto-restart-typescript-eslint-servers/issues/6))

### 0.0.4 (2023-07-18)
* Fix `eslintrc` glob pattern typo ([@kentcdodds](https://github.com/kentcdodds) in [#2](https://github.com/neotan/vscode-auto-restart-typescript-eslint-servers/pull/2))
* Add auto publishing GitHub Action

### 0.0.3 (2023-01-30)
Update icon

## 0.0.2 (2023-01-08)
* Add file monitoring for TypeScript (glob: `**/tsconfig.{json,app.json,app.js,js,ts}`) 
* Add file monitoring for ESLint (glob: `**/.eslintrc.{js,cjs,yaml,yml,json}}`)
* Add toggle commands (`ctrl + shift + p`)
  * `Enable: Auto Restart TypeScript Server`
  * `Disable: Auto Restart TypeScript Server`
  * `Enable: Auto Restart ESLint Server`
  * `Disable: Auto Restart ESLint Server`

### 0.0.1 (2023-01-07)
* Initial release
