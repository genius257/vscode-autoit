/*
 *---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------
 */

import { /* CancellationToken,*/ ExtensionContext, FileSystemError, FileType, ProviderResult, StatusBarAlignment, StatusBarItem, TextDocumentContentProvider, TextEditor, Uri, window, workspace } from 'vscode';
import { DocumentSelector, LanguageClientOptions, NotificationType } from 'vscode-languageclient';
import jschardet from 'jschardet';
import native from '../../server/src/autoit/native.au3?raw';
import { LanguageClient } from 'vscode-languageclient/browser';

let statusBarItem: StatusBarItem;
let indexingStatusBarItem: StatusBarItem;

type IndexingProgress = { loaded: number, total: number };

const IndexingProgressNotification = new NotificationType<IndexingProgress>('autoit3/indexingProgress');

// this method is called when vs code is activated
export function activate(context: ExtensionContext) {
    // eslint-disable-next-line no-console
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

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    client.start().then(() => {
        client.onRequest<string | null, [string]>('fs/readFile', async (uri: string) => {
            const file = Uri.parse(uri);

            let content: Uint8Array;

            try {
                content = await workspace.fs.readFile(file);
            } catch (error) {
                /*
                 * Expected outcomes are reported as null, letting the server try fallback
                 * locations or skip the file: missing files during include resolution, and
                 * directories, which the recursive file watcher reports as change events as
                 * well (e.g. the node_modules and .git folders), but which are never
                 * readable as files.
                 */
                if (error instanceof FileSystemError && (error.code === 'FileNotFound' || error.code === 'FileIsADirectory' || error.code === 'FileNotADirectory')) {
                    return null;
                }

                throw error;
            }

            try {
                return new TextDecoder('utf-8', { fatal: true }).decode(content);
            } catch {
                /*
                 * Not valid UTF-8. jschardet can report `encoding: null` at
                 * runtime (typed as string, but happens for undetectable
                 * input), and reports 'ascii', which is not a TextDecoder
                 * label — windows-1252 is its WHATWG superset.
                 */
                const detected = jschardet.detect(toBinaryString(content));
                const detectedEncoding = detected.encoding.toLowerCase();

                /*
                 * jschardet reports 'ascii', which is not a TextDecoder label;
                 * windows-1252 is its WHATWG superset.
                 */
                const encoding = detectedEncoding === 'ascii' ? 'windows-1252' : detectedEncoding;

                if (!encoding) {
                    throw new Error(`Failed to detect file encoding: ${uri}`);
                }

                try {
                    return new TextDecoder(encoding, { fatal: true }).decode(content);
                } catch {
                    throw new Error(`Failed to decode file as ${encoding}: ${uri}`);
                }
            }
        });

        client.onRequest<string[], [string]>('fs/listFiles', async (baseUri: string) => {
            const files: string[] = [];
            const base = Uri.parse(baseUri);

            const walk = async (dir: Uri): Promise<void> => {
                let entries: [string, FileType][];

                try {
                    entries = await workspace.fs.readDirectory(dir);
                } catch {
                    // Missing or unreadable directories are expected (e.g. wrong configuration paths)
                    return;
                }

                for (const [name, type] of entries) {
                    const child = Uri.joinPath(dir, name);

                    if (type === FileType.Directory) {
                        await walk(child);
                    } else if (name.toLowerCase().endsWith('.au3')) {
                        files.push(child.toString());
                    }
                }
            };

            await walk(base);

            return files;
        });

        // eslint-disable-next-line no-console
        console.log('autoit3-lsp-web-extension server is ready');

        client.onNotification(IndexingProgressNotification, ({ loaded, total }) => {
            if (loaded >= total) {
                indexingStatusBarItem.hide();

                return;
            }

            indexingStatusBarItem.text = `$(sync~spin) AutoIt3: indexing ${loaded}/${total}`;
            indexingStatusBarItem.show();
        });
    });

    const myProvider = new class implements TextDocumentContentProvider {
        // provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
        public provideTextDocumentContent(): ProviderResult<string> {
            return native;
        }
    }();

    context.subscriptions.push(workspace.registerTextDocumentContentProvider('autoit3doc', myProvider));

    statusBarItem = window.createStatusBarItem('genius257.au3.version', StatusBarAlignment.Right, 99);

    // statusBarItem.command = "";
    statusBarItem.name = 'AutoIt3 Parser Target Version';
    statusBarItem.text = '3.3.14.5';

    indexingStatusBarItem = window.createStatusBarItem('genius257.au3.indexing', StatusBarAlignment.Right, 98);
    indexingStatusBarItem.name = 'AutoIt3 Indexing Progress';

    context.subscriptions.push(indexingStatusBarItem);
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

function statusBarStateChange(e: TextEditor | undefined): void {
    if (e?.document.languageId === 'au3') {
        statusBarItem.show();
    } else {
        statusBarItem.hide();
    }
}

/*
 * jschardet's detect() expects a latin-1 "binary" string (one character per
 * byte), or a Node Buffer, which is converted to exactly that internally.
 * Since this runs in a webworker without Buffer, we perform the equivalent
 * conversion ourselves. Done in chunks to avoid blowing the call stack via
 * String.fromCharCode spread on large files.
 */
function toBinaryString(bytes: Uint8Array): string {
    let result = '';
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
        result += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return result;
}
