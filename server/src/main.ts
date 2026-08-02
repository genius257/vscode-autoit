import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';
import { InitializeParams, InitializeResult, ServerCapabilities, CompletionItem, TextDocumentSyncKind, DocumentLinkParams, DocumentLink, CompletionParams, DefinitionParams, LocationLink, DocumentSymbolParams, DocumentSymbol, SymbolKind, SignatureHelp, SignatureHelpParams, Hover, Range, MarkupKind, MarkupContent, CompletionList, ReferenceParams, Location } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import Symbol from './autoit/Symbol';
import nativeSuggestions from './autoit/internal';
import { type AutoIt3 } from 'autoit3-pegjs';
import * as PositionHelper from './autoit/PositionHelper';
import { Workspace } from './autoit/Workspace';
import { CompletionItemBridge } from './providers/CompletionItemBridge';
import { SignatureHelpBridge } from './providers/SignatureHelpBridge';

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
        textDocumentSync: TextDocumentSyncKind.Full,
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
    connection.sendDiagnostics({
        uri,
        diagnostics,
    });
});

connection.onDidOpenTextDocument((params) => {
    workspace.createOrUpdate(params.textDocument.uri, params.textDocument.text);
});

connection.onDidChangeTextDocument((params) => {
    const content = params.contentChanges[0];

    if (content === undefined) {
        return;
    }

    workspace.createOrUpdate(params.textDocument.uri, content.text);
});

connection.onDidCloseTextDocument((params) => {
    workspace.get(params.textDocument.uri)?.release();
});

connection.onDocumentSymbol(getDocumentSymbol);
connection.onDefinition(getDefinition);
connection.onReferences(getReferences);
connection.onCompletion(getCompletionItems);
connection.onSignatureHelp(getSignatureHelp);

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
            .then<DocumentLink[]>(() => includes.filter((include) => !/^autoit3doc:/.test(include.uri ?? '') && include.uri !== null).map<DocumentLink>((include) => ({
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

connection.onHover((hoverParams/* ,token, workDoneProgress*/): Hover | null => {
    const script = workspace.get(hoverParams.textDocument.uri);

    if (script === undefined) {
        return null;
    }

    const nodesAt = script.getNodesAt(hoverParams.position);
    nodesAt.reverse();

    if (nodesAt[0]?.type === 'ExitStatement') {
        return {
            contents: {
                kind: MarkupKind.Markdown,
                value: [
                    '```au3',
                    'Exit ( $return_code = 0 )',
                    '```',
                    'Terminates the script.',
                ].join('\n'),
            },
            range: PositionHelper.locationRangeToRange(nodesAt[0].location),
        };
    }

    const identifierAtPos = nodesAt.find((node): node is AutoIt3.Identifier | AutoIt3.VariableIdentifier | AutoIt3.Macro => node.type === 'Identifier' || node.type === 'VariableIdentifier' || node.type === 'Macro');

    if (identifierAtPos === undefined) {
        return null;
    }

    // Check native suggestions first
    if (identifierAtPos.type === 'Identifier' || identifierAtPos.type === 'Macro') {
        const key = identifierAtPos.type === 'Identifier'
            ? identifierAtPos.name.toLowerCase()
            : identifierAtPos.value.toLowerCase();
        const suggestion = nativeSuggestions[key];

        if (suggestion !== undefined) {
            return {
                contents: { kind: MarkupKind.Markdown, value: (suggestion.detail ?? '') + '\n\n' + suggestion.documentation } satisfies MarkupContent,
                range: PositionHelper.locationRangeToRange(
                    identifierAtPos.location,
                ),
            };
        }
    }

    // Use the new Symbol system with position-aware scope traversal
    const symbolKey = Symbol.getNodeName(identifierAtPos);
    const symbol = workspace.resolveSymbolForNode(identifierAtPos, symbolKey);

    if (symbol === undefined) {
        return null;
    }

    const declarations = [...symbol.getDeclarations()];
    const docblocks = symbol.getDocblocks();

    if (declarations.length === 0 && docblocks.size === 0) {
        return null;
    }

    const contents: MarkupContent = {
        kind: MarkupKind.Markdown,
        value: '',
    };

    // Build hover text from declarations
    for (const declaration of declarations) {
        const docBlock = docblocks.get(declaration);

        if (contents.value === '') {
            contents.value += `\`\`\`au3\n${symbolKey}\n\`\`\``;
        }

        if (docBlock !== undefined) {
            contents.value += `\n\n${docBlock.summary.toString()}\n\n${docBlock.description.toString()}\n\n${docBlock.tags.map((tag) => tag.render()).join('\n\n')}`;
        }
    }

    return {
        contents: contents,
        range: PositionHelper.locationRangeToRange(
            identifierAtPos.location,
        ),
    };
});

// Listen on the connection
connection.listen();

function getDocumentSymbol(
    params: DocumentSymbolParams,
): DocumentSymbol[] | null {
    const script = workspace.get(params.textDocument.uri);

    if (script === undefined) {
        return null;
    }

    const scope = script.getScope();
    const symbols: DocumentSymbol[] = [];

    for (const [, symbol] of scope.getSymbols()) {
        const subscopes = Array.from(scope.getSubscopes());

        for (const declaration of symbol.getDeclarations()) {
            const displayName = symbol.getDisplayName();
            const name = declaration.type === 'VariableIdentifier'
                ? displayName.slice(1)
                : displayName;

            symbols.push({
                kind: declaration.type === 'Identifier'
                    ? SymbolKind.Function
                    : SymbolKind.Variable,
                name: name,
                range: PositionHelper.locationRangeToRange(
                    declaration.location,
                ),
                selectionRange: PositionHelper.locationRangeToRange(
                    declaration.location,
                ),
                children: declaration.type === 'Identifier'
                    ? Array.from(
                        subscopes
                            .find((subscope) => subscope.range !== undefined && PositionHelper.isLocationRangeWithinLocationRange(declaration.location, subscope.range))
                            ?.getSymbols()
                            .values() ?? [],
                    ).reduce<DocumentSymbol[]>((previous, childSymbol) => {
                        for (const childDeclaration of childSymbol.getDeclarations()) {
                            const displayName = childSymbol.getDisplayName();
                            const name = childDeclaration.type === 'VariableIdentifier'
                                ? displayName.slice(1)
                                : displayName;

                            previous.push({
                                kind: childDeclaration.type === 'Identifier'
                                    ? SymbolKind.Function
                                    : SymbolKind.Variable,
                                name: name,
                                range: PositionHelper.locationRangeToRange(
                                    childDeclaration.location,
                                ),
                                selectionRange: PositionHelper.locationRangeToRange(
                                    childDeclaration.location,
                                ),
                            });
                        }

                        return previous;
                    }, [])
                    : [],
            });
        }
    }

    return symbols;
}

function getDefinition(params: DefinitionParams): LocationLink[] {
    const script = workspace.get(params.textDocument.uri);

    if (script === undefined) {
        return [];
    }

    const nodesAt = script.getNodesAt(params.position);
    const identifierAtPos = nodesAt.reverse().find((node): node is AutoIt3.Identifier | AutoIt3.VariableIdentifier | AutoIt3.Macro => node.type === 'Identifier' || node.type === 'VariableIdentifier' || node.type === 'Macro');

    if (identifierAtPos === undefined) {
        return [];
    }

    const symbolKey = Symbol.getNodeName(identifierAtPos);

    const symbol = workspace.resolveSymbolForNode(identifierAtPos, symbolKey);

    if (symbol === undefined) {
        return [];
    }

    return [...symbol.getDeclarations()].map((declaration) => ({
        targetUri: declaration.location.source.toString(),
        targetRange: PositionHelper.locationRangeToRange(
            declaration.location,
        ),
        targetSelectionRange: PositionHelper.locationRangeToRange(
            declaration.location,
        ),
    }));
}

async function getCompletionItems(
    params: CompletionParams,
): Promise<CompletionItem[] | CompletionList | undefined | null> {
    const completionItemBridge = new CompletionItemBridge(workspace);

    return completionItemBridge.resolveCompletionItems(
        params.textDocument.uri,
        params.position,
    );
}

let lastSignatureHelpBridge: SignatureHelpBridge | undefined;

function getSignatureHelp(params: SignatureHelpParams): SignatureHelp | null {
    const signatureHelpBridge = params.context?.isRetrigger && lastSignatureHelpBridge !== undefined ? lastSignatureHelpBridge : new SignatureHelpBridge(workspace);
    lastSignatureHelpBridge = signatureHelpBridge;

    return signatureHelpBridge.resolveSignatureHelp(
        params,
    );
}

function getReferences(params: ReferenceParams): Location[]|null|undefined {
    const script = workspace.get(params.textDocument.uri);

    if (script === undefined) {
        return null;
    }

    const nodesAt = script.getNodesAt(params.position);
    const identifierAtPos = nodesAt.reverse().find((node): node is AutoIt3.Identifier | AutoIt3.VariableIdentifier | AutoIt3.Macro => node.type === 'Identifier' || node.type === 'VariableIdentifier' || node.type === 'Macro');

    if (identifierAtPos === undefined) {
        return null;
    }

    const symbolKey = Symbol.getNodeName(identifierAtPos);

    const symbol = workspace.resolveSymbolForNode(identifierAtPos, symbolKey);

    if (symbol === undefined) {
        return null;
    }

    const results: Location[] = [];

    if (params.context.includeDeclaration) {
        results.push(...[...symbol.getDeclarations()].map((declaration): Location => ({
            uri: declaration.location.source.toString(),
            range: PositionHelper.locationRangeToRange(declaration.location),
        })));
    }

    results.push(...[...symbol.getReferences()].map((reference): Location => ({
        uri: reference.location.source.toString(),
        range: PositionHelper.locationRangeToRange(reference.location),
    })));

    return results;
}
