// import { TextDocument } from 'vscode-languageserver-textdocument';
import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';
import { /* Color, ColorInformation, Range,*/ InitializeParams, InitializeResult, ServerCapabilities, /* TextDocuments,*/ CompletionItem, CompletionItemKind, TextDocumentSyncKind, DocumentLinkParams, DocumentLink, CompletionParams, DefinitionParams, LocationLink, DocumentSymbolParams, DocumentSymbol, SymbolKind, SignatureHelp, SignatureHelpParams, ParameterInformation, Hover, Range, MarkupKind, MarkupContent } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import nativeSuggestions from './autoit/internal';
import { type AutoIt3, type LocationRange } from 'autoit3-pegjs';
import * as Parser from './autoit/Parser';
import * as PositionHelper from './autoit/PositionHelper';
import { AutoIt3Configuration, Workspace } from './autoit/Workspace';
import { NodeFilterAction } from './autoit/Script';
import DocBlockFactory from './autoit/docBlock/DocBlockFactory';
import InvalidTag from './autoit/docBlock/DocBlock/Tags/InvalidTag';
import MarkdownFormatter from './autoit/docBlock/DocBlock/Tags/Formatter/MarkdownFormatter';
import FqsenResolver from './autoit/docBlock/FqsenResolver';
import StandardTagFactory from './autoit/docBlock/DocBlock/StandardTagFactory';
import MarkdownDescriptionFactory from './autoit/docBlock/DocBlock/MarkdownDescriptionFactory';

console.log('running server autoit3-lsp-web-extension');

type WhereAstTypeEquals<T extends { type: string }, S extends string> =
    T extends { type: S } ? T : never;

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
                contents: { kind: MarkupKind.Markdown, value: suggestion.detail + '\n\n' + suggestion.documentation } satisfies MarkupContent,
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

            contents.value += `\`\`\`au3\n${identifierAtPos.type === 'VariableIdentifier' ? '$' : ''}${identifier.id.name}${value === null ? '' : ' = ' + value}\n\`\`\``;

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

function getSignatureHelp(params: SignatureHelpParams): SignatureHelp | null {
    const script = workspace.get(params.textDocument.uri);

    if (script === undefined) {
        return null;
    }

    const nodesAt = script.getNodesAt(params.position);

    if (nodesAt === undefined) {
        return null;
    }

    const callExpression = nodesAt.reverse().find((node): node is WhereAstTypeEquals<AutoIt3.CallExpression, 'CallExpression'> => node.type === 'CallExpression');

    if (callExpression === undefined) {
        return null;
    }

    /**
     * FIXME: currently due to the issue with nested call expressions, call expressions deeper than what is expected is returned,
     * resulting in wrong function signature matching.
     * Not much to do about that at the moment.
     * So InetGet()() would give the signature for InetGet(), which is not what we want.
     * The position issue at the parser level need to be fixed first, and then to provide signature help for the second part,
     * we need functionality to resolve the result of the first call expression.
     * And for that we need support type analysis.
     */

    const text = script.getText();

    if (text === undefined) {
        return null;
    }

    let parameterIndex: number | null = null;

    if (callExpression.arguments.length > 0) {
        type Writeable<T> = { -readonly [P in keyof T]: T[P] };

        // Make new array of deep cloned location ranges, to prevent modifying original AST location values.
        const argumentLocations = callExpression.arguments
            .map<Writeable<LocationRange>>(
                (argument) => JSON.parse(JSON.stringify(argument.location)),
            );
        let textBetween = text.substring(
            callExpression.callee.location.end.offset,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            argumentLocations[0]!.start.offset,
        );
        let parenthesisIndex = textBetween.indexOf('(');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        argumentLocations[0]!.start = PositionHelper.offsetToLocation(
            // eslint-disable-next-line @stylistic/max-len, @typescript-eslint/no-non-null-assertion
            argumentLocations[0]!.start.offset - Math.abs(textBetween.length - 1 - parenthesisIndex),
            text,
        );

        if (argumentLocations.length > 1) {
            for (let index = 0; index < argumentLocations.length - 1; index++) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const argumentLeft = argumentLocations[index]!;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const argumentRight = argumentLocations[index + 1]!;
                const textBetween = text.substring(
                    argumentLeft.end.offset,
                    argumentRight.start.offset,
                );
                const commaIndex = textBetween.indexOf(',');
                argumentLeft.end = PositionHelper.offsetToLocation(
                    argumentLeft.end.offset + commaIndex,
                    text,
                );
                argumentRight.start = PositionHelper.offsetToLocation(
                    // eslint-disable-next-line @stylistic/max-len
                    argumentRight.start.offset - Math.abs(textBetween.length - 1 - commaIndex),
                    text,
                );
            }
        }

        textBetween = text.substring(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            argumentLocations[argumentLocations.length - 1]!.end.offset,
            callExpression.location.end.offset,
        );
        parenthesisIndex = textBetween.indexOf(')');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        argumentLocations[argumentLocations.length - 1]!.end = PositionHelper
            .offsetToLocation(
                // eslint-disable-next-line @stylistic/max-len, @typescript-eslint/no-non-null-assertion
                argumentLocations[argumentLocations.length - 1]!.end.offset + parenthesisIndex,
                text,
            );

        parameterIndex = argumentLocations.findIndex(
            (location) => PositionHelper.isPositonWithinLocationRange(
                params.position,
                location,
            ),
        );
    }

    if (
        params.context?.isRetrigger &&
        params.context.activeSignatureHelp !== undefined
    ) {
        if (callExpression.arguments.length > 0) {
            if (parameterIndex === -1) {
                return null;
            }

            // eslint-disable-next-line @stylistic/max-len
            if (params.context.activeSignatureHelp.activeParameter !== undefined && parameterIndex !== -1) {
                // eslint-disable-next-line @stylistic/max-len
                params.context.activeSignatureHelp.activeParameter = parameterIndex ?? undefined;
            }
        } else {
            params.context.activeSignatureHelp.activeParameter = undefined;
        }

        return params.context.activeSignatureHelp;
    }

    // FIXME: this currently won't work for member expressions!

    if (callExpression.callee.type === 'CallExpression' || callExpression.callee.type === 'ParenthesizedExpression' || /* callExpression.callee.type === "ExpressionStatement" || callExpression.callee.type === "Macro" ||*/ callExpression.callee.type === 'MemberExpression' || callExpression.callee.type === 'Literal' || callExpression.callee.type === 'Keyword') {
        return null;
    }

    const declarator = script.getIdentifierDeclarator(callExpression.callee);

    if (!declarator) {
        return null;
    }

    if (declarator === null || declarator.type === 'VariableDeclarator' || declarator.type === 'Parameter') { // FIXME: currently we don't look for identifier in the VariableDeclarator init!
        return null;
    }

    return {
        signatures: [
            {
                label: declarator.id.name + '(' + Parser.AstArrayToStringArray(declarator.params).join(', ') + ')',
                documentation: undefined, // FIXME: built in funcs have this as not undefined
                // eslint-disable-next-line @stylistic/max-len
                parameters: declarator.params.map((parameter): ParameterInformation => ({
                    label: '$' + parameter.id.name,
                    documentation: undefined, // FIXME: built in funcs have this as not undefined in the future
                })),
            },
        ],
        activeParameter: parameterIndex ?? undefined,
        activeSignature: 0,
    };
}

// const colorRegExp = /#([0-9A-Fa-f]{6})/g;

// NOTE: currently colorization is done via simple vscode tmLanguage logic, but using the parser, when ready may be a better choice. Time will tell.
/*
 *function getColorInformation(textDocument: TextDocumentIdentifier) {
 *  const colorInfos: ColorInformation[] = [];
 *
 *  const document = documents.get(textDocument.uri);
 *  if (document) {
 *      const text = document.getText();
 *
 *      colorRegExp.lastIndex = 0;
 *      let match;
 *      while ((match = colorRegExp.exec(text)) != null) {
 *          const offset = match.index;
 *          const length = match[0].length;
 *
 *          const range = Range.create(document.positionAt(offset), document.positionAt(offset + length));
 *          const color = parseColor(text, offset);
 *          colorInfos.push({ color, range });
 *      }
 *  }
 *
 *  return colorInfos;
 *}
 *
 *function getColorPresentation(color: Color, range: Range) {
 *  const result: ColorPresentation[] = [];
 *  const red256 = Math.round(color.red * 255), green256 = Math.round(color.green * 255), blue256 = Math.round(color.blue * 255);
 *
 *  function toTwoDigitHex(n: number): string {
 *      const r = n.toString(16);
 *      return r.length !== 2 ? '0' + r : r;
 *  }
 *
 *  const label = `#${toTwoDigitHex(red256)}${toTwoDigitHex(green256)}${toTwoDigitHex(blue256)}`;
 *  result.push({ label: label, textEdit: TextEdit.replace(range, label) });
 *
 *  return result;
 *}
 *
 *
 *const enum CharCode {
 *  Digit0 = 48,
 *  Digit9 = 57,
 *
 *  A = 65,
 *  F = 70,
 *
 *  a = 97,
 *  f = 102,
 *}
 *
 *function parseHexDigit(charCode: CharCode): number {
 *  if (charCode >= CharCode.Digit0 && charCode <= CharCode.Digit9) {
 *      return charCode - CharCode.Digit0;
 *  }
 *  if (charCode >= CharCode.A && charCode <= CharCode.F) {
 *      return charCode - CharCode.A + 10;
 *  }
 *  if (charCode >= CharCode.a && charCode <= CharCode.f) {
 *      return charCode - CharCode.a + 10;
 *  }
 *  return 0;
 *}
 *
 *function parseColor(content: string, offset: number): Color {
 *  const r = (16 * parseHexDigit(content.charCodeAt(offset + 1)) + parseHexDigit(content.charCodeAt(offset + 2))) / 255;
 *  const g = (16 * parseHexDigit(content.charCodeAt(offset + 3)) + parseHexDigit(content.charCodeAt(offset + 4))) / 255;
 *  const b = (16 * parseHexDigit(content.charCodeAt(offset + 5)) + parseHexDigit(content.charCodeAt(offset + 6))) / 255;
 *  return Color.create(r, g, b, 1);
 *}
 */
