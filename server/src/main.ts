import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';
import { InitializeParams, InitializeResult, ServerCapabilities, TextDocumentSyncKind, DocumentLinkParams, DocumentLink, DefinitionParams, LocationLink, DocumentSymbolParams, DocumentSymbol, SymbolKind, Hover, Range, MarkupKind, MarkupContent, ReferenceParams, Location, DocumentHighlightParams, DocumentHighlight, TextDocumentContentChangeEvent, CodeLens } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import Symbol, { type Node as SymbolNode } from './autoit/Symbol';
import { getScopeLabel } from './autoit/DeclarationScope';
import nativeSuggestions from './autoit/internal';
import { type AutoIt3 } from 'autoit3-pegjs';
import * as PositionHelper from './autoit/PositionHelper';
import * as Parser from './autoit/Parser';
import { Workspace } from './autoit/Workspace';
import buildSignatureLabel from './utils/signatureParams';
import providers from './providers';

// eslint-disable-next-line no-console
console.log('running server autoit3-lsp-web-extension');

/* browser specific setup code */

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

/* from here on, all code is non-browser specific and could be shared with a regular extension */

// connection.onDidChangeTextDocument((params: DidChangeTextDocumentParams) => console.log(params.contentChanges));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
connection.onInitialize((params: InitializeParams): InitializeResult => {
    const capabilities: ServerCapabilities = {
        completionProvider: {
            resolveProvider: false,
            triggerCharacters: [
                '$',
                '.',
                '@',
            ],
            workDoneProgress: false,
        },
        definitionProvider: {
            workDoneProgress: false,
        },
        documentHighlightProvider: {
            workDoneProgress: false,
        },
        documentLinkProvider: {
            resolveProvider: false,
            workDoneProgress: false,
        },
        hoverProvider: {
            workDoneProgress: false,
        },
        documentSymbolProvider: {
            workDoneProgress: false,
        },
        referencesProvider: {
            workDoneProgress: false,
        },
        signatureHelpProvider: {
            triggerCharacters: [
                '(',
                ',',
            ],
            retriggerCharacters: [','],
            workDoneProgress: false,
        },
        codeLensProvider: {
            resolveProvider: true,
            workDoneProgress: false,
        },
        textDocumentSync: TextDocumentSyncKind.Incremental,
    };

    return { capabilities };
});

/*
 * Track open, change and close text document events
 * This currently does not work! Maybe caused by current dependency version or a limitation for a JS worker script LSP?
 * const documents = new TextDocuments(TextDocument);
 * documents.listen(connection);
 */

const workspace = new Workspace(connection);
workspace.eventEmitter.on('diagnostics', function ({ uri, diagnostics }) {
    // connection.window.showWarningMessage("onDiagnostics");
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    connection.sendDiagnostics({
        uri,
        diagnostics,
    });
});

connection.onDidOpenTextDocument((params) => {
    workspace.setScriptActive(params.textDocument.uri, true);
    workspace.createOrUpdate(params.textDocument.uri, params.textDocument.text);
});

connection.onDidChangeTextDocument((params) => {
    const changes = params.contentChanges;

    if (changes.length === 0) {
        return;
    }

    const firstChange = changes[0];

    if (firstChange === undefined) {
        return;
    }

    if (TextDocumentContentChangeEvent.isFull(firstChange)) {
        workspace.createOrUpdate(params.textDocument.uri, firstChange.text);

        return;
    }

    /*
     * Batch all incremental changes of the notification into a single update,
     * so Script.updateAll(), analyze() and dependency recomputation run once.
     */
    const incrementalChanges = changes
        .filter(TextDocumentContentChangeEvent.isIncremental)
        .map((contentChange) => contentChange);

    if (incrementalChanges.length > 0) {
        workspace.createOrUpdate(params.textDocument.uri, incrementalChanges);
    }
});

connection.onDidCloseTextDocument((params) => {
    workspace.setScriptActive(params.textDocument.uri, false);
    workspace.get(params.textDocument.uri)?.release();
});

providers.forEach((provider) => {
    const instance = new provider(workspace);
    instance.register(connection);
});

connection.onDocumentLinks((params: DocumentLinkParams) => {
    // const documentText = documents.get(params.textDocument.uri)?.getText();

    const includes = workspace.get(params.textDocument.uri)?.getIncludes();

    if (includes !== undefined) {
        const statementToRange = (
            statement: AutoIt3.IncludeStatement,
        ): Range => ({
            start: {
                line: statement.location.start.line - 1,
                character: Math.max(
                    0,
                    statement.location.end.column - statement.file.length - 3,
                ),
            },
            end: {
                line: statement.location.end.line - 1,
                character: statement.location.end.column - 1,
            },
        });

        return Promise
            .all(includes.map((include) => include.promise))
            .then<DocumentLink[]>(() => includes.filter((include) => !(include.uri ?? '').startsWith('autoit3doc:') && include.uri !== null).map<DocumentLink>((include) => ({
                range: statementToRange(include.statement),
                target: include.uri ?? undefined,
                tooltip: include.uri === null
                    ? undefined
                    : URI.parse(include.uri).fsPath,
            })));
    } else {
        return [];
    }
});

// Listen on the connection
connection.listen();
