import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';
import { InitializeParams, InitializeResult, ServerCapabilities, CompletionItem, TextDocumentSyncKind, DocumentLinkParams, DocumentLink, CompletionParams, DefinitionParams, LocationLink, DocumentSymbolParams, DocumentSymbol, SymbolKind, SignatureHelp, SignatureHelpParams, Hover, Range, MarkupKind, MarkupContent, CompletionList } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import nativeSuggestions from './autoit/internal';
import { type AutoIt3 } from 'autoit3-pegjs';
import * as Parser from './autoit/Parser';
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
workspace.onDiagnostics(function (uri, diagnostics) {
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

    if (identifierAtPos.type === 'Identifier' || identifierAtPos.type === 'Macro') {
        const suggestion = identifierAtPos.type === 'Identifier' ? nativeSuggestions[identifierAtPos.name.toLowerCase()] : nativeSuggestions[identifierAtPos.value.toLowerCase()];

        if (suggestion !== undefined) {
            return {
                contents: { kind: MarkupKind.Markdown, value: (suggestion.detail ?? '') + '\n\n' + suggestion.documentation } satisfies MarkupContent,
                range: PositionHelper.locationRangeToRange(
                    identifierAtPos.location,
                ),
            };
        }
    }

    let identifier:
        | AutoIt3.FormalParameter
        | AutoIt3.FunctionDeclaration
        | AutoIt3.VariableDeclaration
        | AutoIt3.EnumDeclaration
        | null
        | undefined = null;

    identifier = identifier ??
        workspace.get(hoverParams.textDocument.uri)
            ?.getIdentifierDeclarator(identifierAtPos);

    if (!identifier) {
        return null;
    }

    const contents: MarkupContent = {
        kind: MarkupKind.Markdown,
        value: '',
    };

    switch (identifier.type) {
        case 'VariableDeclarator':
        {
            let value: string | null = null;

            if (identifier.init !== null) {
                value = Parser.AstToString(identifier.init);
            }

            const dimensions = 'dimensions' in identifier ? '[' + Parser.AstArrayToStringArray(identifier.dimensions.filter((dimension) => dimension !== null)) + ']' : '';

            contents.value += `\`\`\`au3\n${identifierAtPos.type === 'VariableIdentifier' ? '$' : ''}${identifier.id.name}${dimensions}${value === null ? '' : ' = ' + value}\n\`\`\``;

            break;
        }
        case 'FunctionDeclaration':
        {
            contents.value += `\`\`\`au3\nFunc ${identifier.id.name}(${Parser.AstArrayToStringArray(identifier.params).join(', ')})\n\`\`\``;

            break;
        }
        case 'Parameter':
        {
            let parameterValue: string | number | boolean | null | undefined;

            if (identifier.init !== null) {
                parameterValue = Parser.AstToString(identifier.init);
            }

            contents.value += `\`\`\`au3\n(parameter) $${identifier.id.name}${parameterValue === undefined ? '' : ' = ' + parameterValue}\n\`\`\``;

            break;
        }
        default:
            return null;
    }

    const identifierScript = workspace.get(identifier.location.source);

    if (identifierScript !== undefined && (
        identifier.type === 'FunctionDeclaration' ||
        identifier.type === 'VariableDeclarator'
    )) {
        const docBlock = identifierScript.docBlocks.get(identifier);

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

    return script.declarations.map((declaration) => {
        return {
            kind: declaration.type === 'FunctionDeclaration' ? SymbolKind.Function : SymbolKind.Variable,
            name: declaration.id.name,
            range: PositionHelper.locationRangeToRange(
                declaration.location,
            ),
            selectionRange: PositionHelper.locationRangeToRange(
                declaration.id.location,
            ),
        };
    });
}

function getDefinition(params: DefinitionParams): LocationLink[] {
    const nodesAt = workspace.get(params.textDocument.uri)
        ?.getNodesAt(params.position);
    const identifierAtPos = nodesAt?.reverse().find((node): node is AutoIt3.Identifier | AutoIt3.VariableIdentifier | AutoIt3.Macro => node.type === 'Identifier' || node.type === 'VariableIdentifier' || node.type === 'Macro');

    if (identifierAtPos === undefined) {
        return [];
    }

    const declarator = workspace.get(params.textDocument.uri)
        ?.getIdentifierDeclarator(identifierAtPos);

    if (declarator === null || declarator === undefined) {
        return [];
    }

    const identifier = declarator.id;

    return [
        {
            targetUri: declarator.location.source.toString(),
            targetRange: PositionHelper.locationRangeToRange(
                declarator.location,
            ),
            targetSelectionRange: PositionHelper.locationRangeToRange(
                identifier.location,
            ),
        },
    ];
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
