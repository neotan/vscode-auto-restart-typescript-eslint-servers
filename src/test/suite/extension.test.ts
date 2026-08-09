import * as assert from 'assert'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.')

  test('activates with Remark and Astro watcher defaults', async () => {
    const extension = vscode.extensions.getExtension(
      'neotan.vscode-auto-restart-typescript-eslint-servers'
    )
    assert.ok(extension)

    await extension.activate()

    const config = vscode.workspace.getConfiguration('autoRestart')
    assert.strictEqual(config.get('monitorFilesForRemark'), true)
    assert.deepStrictEqual(config.get('fileGlobForRemark'), [
      '**/.remark{ignore,rc,rc.cjs,rc.js,rc.json,rc.mjs,rc.yaml,rc.yml}',
      '**/package.json',
      '**/.git/HEAD',
    ])
    assert.strictEqual(config.get('showRestartNotificationForRemark'), true)

    assert.strictEqual(config.get('monitorFilesForAstro'), true)
    assert.deepStrictEqual(config.get('fileGlobForAstro'), [
      '**/astro.config.{mjs,js,ts,mts}',
      '**/.git/HEAD',
    ])
    assert.strictEqual(config.get('showRestartNotificationForAstro'), true)
  })
})
