/*
 *---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------
 */

import { /* CancellationToken,*/ ExtensionContext, ProviderResult, StatusBarAlignment, StatusBarItem, TextDocumentContentProvider, TextEditor, Uri, window, workspace } from 'vscode';
import { DocumentSelector, LanguageClientOptions } from 'vscode-languageclient';
import native from '../../server/src/autoit/native.au3?raw';
import { LanguageClient } from 'vscode-languageclient/browser';

let statusBarItem: StatusBarItem;

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

    client.start().then(() => {
        client.onRequest('openTextDocument', (uri: string) => {
            const file = Uri.parse(uri);

            return workspace.openTextDocument(file).then((textDocument) => {
                return textDocument.getText();
            }, () => {
                return null;
            });
        });

        console.log('autoit3-lsp-web-extension server is ready');
    });

    const myProvider = new class implements TextDocumentContentProvider {
        // provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
        provideTextDocumentContent(): ProviderResult<string> {
            return native;
        }
    }();

    context.subscriptions.push(workspace.registerTextDocumentContentProvider('autoit3doc', myProvider));

    statusBarItem = window.createStatusBarItem('genius257.au3.version', StatusBarAlignment.Right, 99);

    // statusBarItem.command = "";
    statusBarItem.name = 'AutoIt3 Parser Target Version';
    statusBarItem.text = '3.3.14.5';
    context.subscriptions.push(
        window.onDidChangeActiveTextEditor(statusBarStateChange),
    );
    statusBarStateChange(window.activeTextEditor);
}

function createWorkerLanguageClient(
    context: ExtensionContext,
    clientOptions: LanguageClientOptions,
) {
    // Create a worker. The worker main file implements the language server.
    const serverMain = Uri.joinPath(context.extensionUri, 'server/dist/main.js');

    const worker = new Worker(serverMain.toString(true));

    // create the language server client to communicate with the server running in the worker
    return new LanguageClient('autoit3-lsp-web-extension', 'AutoIt3 LSP Web Extension', clientOptions, worker);
}

function statusBarStateChange(e: TextEditor): void {
    if (e?.document?.languageId === 'au3') {
        statusBarItem.show();
    } else {
        statusBarItem.hide();
    }
}
