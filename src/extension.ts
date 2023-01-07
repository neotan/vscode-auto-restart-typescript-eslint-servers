import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "auto-restart-typescript-and-eslint-servers" is now active!');

	let disposable = vscode.commands.registerCommand('auto-restart-typescript-and-eslint-servers.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Auto Restart TypeScript and ESLint Servers!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
