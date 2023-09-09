import * as vscode from 'vscode';

export function activate() {
	try {
		const folders = vscode.workspace.workspaceFolders![0].uri.path;

		if (folders) {
			const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(folders, '**/*.sol'));

			watcher.onDidCreate(uri => {
				const path = uri.path.slice(1);
				const fileNameSplit = path.split('/').at(-1);
				if (fileNameSplit) {
					const firstLetterToUpperCase = fileNameSplit.charAt(0).toUpperCase();
					const fileName = firstLetterToUpperCase + fileNameSplit.slice(1, -4);
					const snippet = new vscode.SnippetString(`// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

contract ${fileName} {
		$1
}`);
					vscode.window.activeTextEditor?.document.fileName!.split('.').pop() === 'sol' && !vscode.window.activeTextEditor?.document.getText()
						? vscode.window.activeTextEditor?.insertSnippet(snippet)
						: null;
				}
			});
		}
	} catch (error) {
		console.log(error);
	}
}

export function deactivate() {}
