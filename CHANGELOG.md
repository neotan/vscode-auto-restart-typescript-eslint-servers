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
