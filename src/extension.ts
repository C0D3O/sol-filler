import { RelativePattern, SnippetString, window, workspace } from 'vscode';

export function activate() {
	try {
		const folders = workspace.workspaceFolders![0].uri.path;

		if (folders) {
			const watcher = workspace.createFileSystemWatcher(new RelativePattern(folders, '**/*.sol'));

			watcher.onDidCreate((uri) => {
				const path = uri.path.slice(1);
				const fileNameSplit = path.split('/').at(-1);
				if (fileNameSplit) {
					const firstLetterToUpperCase = fileNameSplit.charAt(0).toUpperCase();
					const fileName = firstLetterToUpperCase + fileNameSplit.slice(1, -4);
					const snippet = new SnippetString(`// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

contract ${fileName} {
		$1
}`);
					window.activeTextEditor?.document.fileName!.split('.').pop() === 'sol' && !window.activeTextEditor?.document.getText()
						? window.activeTextEditor?.insertSnippet(snippet)
						: null;
				}
			});
		}
	} catch (error) {
		console.log(error);
	}
}

export function deactivate() {}
