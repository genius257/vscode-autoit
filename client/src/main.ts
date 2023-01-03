/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, Uri, window, workspace } from 'vscode';
import { Utils } from 'vscode-uri';
import { DocumentSelector, LanguageClientOptions } from 'vscode-languageclient';

import { LanguageClient } from 'vscode-languageclient/browser';

// this method is called when vs code is activated
export function activate(context: ExtensionContext) {

	console.log('autoit3-lsp-web-extension activated!');

	/* 
	 * all except the code to create the language client in not browser specific
	 * and couuld be shared with a regular (Node) extension
	 */
	const documentSelector: DocumentSelector | string = [{ language: 'au3' }];

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector,
		synchronize: {},
		initializationOptions: {},
	};

	const client = createWorkerLanguageClient(context, clientOptions);

	const disposable = client.start();
	context.subscriptions.push(disposable);

	client.onReady().then(() => {
		client.onRequest("openTextDocument", (uri: string) => {
			const file = Uri.parse(uri);
			return workspace.openTextDocument(file).then(textDocument => {
				return textDocument.getText();
			}, (reason) => {
				return null;
			});
		});

		console.log('autoit3-lsp-web-extension server is ready');
	});
}

function createWorkerLanguageClient(context: ExtensionContext, clientOptions: LanguageClientOptions) {
	// Create a worker. The worker main file implements the language server.
	const serverMain = Uri.joinPath(context.extensionUri, 'server/dist/main.js');
	const worker = new Worker(serverMain.toString());

	// create the language server client to communicate with the server running in the worker
	return new LanguageClient('autoit3-lsp-web-extension', 'AutoIt3 LSP Web Extension', clientOptions, worker);
}
