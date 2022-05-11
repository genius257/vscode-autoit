/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';

import { Color, ColorInformation, Range, InitializeParams, InitializeResult, ServerCapabilities, TextDocuments, ColorPresentation, TextEdit, TextDocumentIdentifier, CompletionItem, CompletionItemKind, VersionedTextDocumentIdentifier, DidChangeTextDocumentParams, TextDocumentSyncKind, DocumentLinkParams, DocumentLink, CompletionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { URI, Utils } from 'vscode-uri';

import * as parser from "./autoit3"
import FileAstMap from './FileAstMap';

console.log('running server lsp-web-extension-sample');

/* browser specific setup code */

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

/* from here on, all code is non-browser specific and could be shared with a regular extension */

type Autoit3AstNode = {
	type: string,
	id?: {
		type: string,
		name: string,
	},
	declarations?: Array<Autoit3AstNode>,
	file?: string,
	body?: Autoit3AstNode[],
	location?: parser.IFileRange,
	params?: Autoit3AstNode[],
};

let Autoit3Ast = null;

connection.onDidChangeTextDocument((params: DidChangeTextDocumentParams) => console.log(params.contentChanges));

connection.onInitialize((params: InitializeParams): InitializeResult => {
	const capabilities: ServerCapabilities = {
		completionProvider: {
			resolveProvider: false,
			//triggerCharacters: [ '.' ]
		},
		textDocumentSync: TextDocumentSyncKind.Full,
		documentLinkProvider: {
			resolveProvider: false
		},
	};
	return { capabilities };
});

// Track open, change and close text document events
const documents = new TextDocuments(TextDocument);
documents.listen(connection);

const fileAstMap = new FileAstMap<Autoit3AstNode, parser.ParseFunction>(parser.parse);
connection.onDidOpenTextDocument(params => {
	try {
		fileAstMap.add(params.textDocument.uri, parser.parse(params.textDocument.text));
		connection.sendDiagnostics({
			uri: params.textDocument.uri,
			diagnostics: [],
		});
	} catch (e) {
		fileAstMap.add(params.textDocument.uri, parser.parse(""));
		const error = e as (Error | parser.SyntaxError) & {location?: parser.IFileRange};
		connection.sendDiagnostics({
			uri: params.textDocument.uri,
			diagnostics: [{
				message: error.message,
				range: {
					start: {
						line: (error.location?.start.line ?? 1) - 1,
						character: (error.location?.start.column || 1) - 1,
					},
					end: {
						line: (error.location?.end.line ?? 1) - 1,
						character: (error.location?.end.column ?? 0) - 1,
					}
				}
			}]
		});
	}
});

connection.onDidChangeTextDocument(params => {
	try {
		fileAstMap.add(params.textDocument.uri, parser.parse(params.contentChanges[0].text));
		connection.sendDiagnostics({
			uri: params.textDocument.uri,
			diagnostics: [],
		});
	} catch (e) {
		fileAstMap.add(params.textDocument.uri, parser.parse(""));
		const error = e as (Error | parser.SyntaxError) & {location?: parser.IFileRange};
		connection.sendDiagnostics({
			uri: params.textDocument.uri,
			diagnostics: [{
				message: error.message,
				range: {
					start: {
						line: (error.location?.start.line ?? 1) - 1,
						character: (error.location?.start.column || 1) - 1,
					},
					end: {
						line: (error.location?.end.line ?? 1) - 1,
						character: (error.location?.end.column ?? 1) - 1,
					}
				}
			}]
		});
	}
});

connection.onDidCloseTextDocument(params => {
	fileAstMap.release(params.textDocument.uri);
	connection.sendDiagnostics({
		uri: params.textDocument.uri,
		diagnostics: [],
	});
});

// Register providers
//connection.onDocumentColor(params => getColorInformation(params.textDocument));
//connection.onColorPresentation(params => getColorPresentation(params.color, params.range));
connection.onCompletion(params => getCompletionItems(params));

connection.onDocumentLinks((params: DocumentLinkParams) => {
	const documentText = documents.get(params.textDocument.uri)?.getText();
	//const ast:{body?: Autoit3AstNode[]} = documentText !== undefined ? parser.parse(documentText) : [];
	const ast = fileAstMap.get(params.textDocument.uri);
	//connection.console.info(params.textDocument.uri);
	//URI.parse(params.textDocument.uri)

	return ast.body?.reduce<DocumentLink[]>((previousValue: DocumentLink[], currentValue: Autoit3AstNode) => {
		switch (currentValue.type) {
			case "IncludeStatement":
				//connection.console.info(resolveIncludePath(params.textDocument.uri, currentValue.file || "."));
				//TODO: check if some code for handling multi-line include statement text handling is needed.
				previousValue.push({
					range: {
						start: {
							line: (currentValue.location?.start.line || 1) - 1,
							character: (currentValue.location?.end.column || 0) - (currentValue.file?.length || 0) - 3
						},
						end: {
							line: (currentValue.location?.end.line || 1) - 1,
							character: (currentValue.location?.end.column || 0) - 1
						},
					},
					target: resolveIncludePath(params.textDocument.uri, currentValue.file || "."),
				});
				break;
			default:
				break;
		}

		return previousValue;
	}, []);
});

// Listen on the connection
connection.listen();

function getCompletionItems(params: CompletionParams): CompletionItem[] {
	const documentText = documents.get(params.textDocument.uri)?.getText();
	//params.position
	//const ast:{body?: Autoit3AstNode[]} = documentText !== undefined ? parser.parse(documentText) : [];
	const ast = fileAstMap.get(params.textDocument.uri);

	// FIXME: filter the top level function declarations and varaible declarations, extract identifiers and return the array
	//return ast.body.filter((item: { type: string; }) => item.type === "FunctionDeclaration" || item.type === "VariableDeclaration" )
	//return ast.body.filter((item: { type: string; }) => item.type === "FunctionDeclaration" ).map<CompletionItem>((item: { id: { name: string; }; }) => ({label: item.id.name, kind: CompletionItemKind.Function}));
	return ast.body?.reduce<CompletionItem[]>((previousValue: CompletionItem[], currentValue: Autoit3AstNode) => {
		switch (currentValue.type) {
			case "FunctionDeclaration":
				previousValue.push({
					label: currentValue.id?.name || "",
					kind: CompletionItemKind.Function,
				});

				if (params.position.line >= ((currentValue.location?.start.line || 1) - 1) && params.position.line < ((currentValue.location?.end.line || 1) - 1)) {
					currentValue.params?.forEach(value => previousValue.push({
						label: "$" + value.id?.name,
						kind: CompletionItemKind.Variable,
						insertText: "$" + value.id?.name,
					}))
					previousValue.push(...extractCompletionItems(currentValue.body || []));
				}
				break;
			case "VariableDeclaration":
				(currentValue.declarations||[]).forEach(declaration => {
					if(declaration.type === "VariableDeclarator" && declaration.id?.type === "VariableIdentifier") {
						previousValue.push({
							label: "$" + declaration.id.name,
							kind: CompletionItemKind.Variable,
							insertText: declaration.id.name, //FIXME: this need to have start of string removed equal to current typed in string.
						});
					}
				});
				break;
			default:
				break;
		}

		return previousValue;
	}, []) || [];
}

/**
 * Extracts completion items from function declation and nested elemenets within, containing completion items.
 * This is needed to get things in current scope, within functions.
 */
function extractCompletionItems(nodes: Autoit3AstNode[]): CompletionItem[] {
	return nodes.reduce((previousValue: CompletionItem[], currentValue: Autoit3AstNode) => {
		switch (currentValue.type) {
			case "VariableDeclaration":
				(currentValue.declarations||[]).forEach(declaration => {
					if(declaration.type === "VariableDeclarator" && declaration.id?.type === "VariableIdentifier") {
						previousValue.push({
							label: "$" + declaration.id.name,
							kind: CompletionItemKind.Variable,
						});
					}
				});
				break;
				//FIXME: add cases for IF, FOR, SWITCH and more expressions.
			default:
				break;
		}
		return previousValue;
	}, []);
}

const colorRegExp = /#([0-9A-Fa-f]{6})/g;

//NOTE: currently colorization is done via simple vscode tmLanguage logic, but using the parser, when ready may be a better choice. Time will tell.
function getColorInformation(textDocument: TextDocumentIdentifier) {
	const colorInfos: ColorInformation[] = [];

	const document = documents.get(textDocument.uri);
	if (document) {
		const text = document.getText();

		colorRegExp.lastIndex = 0;
		let match;
		while ((match = colorRegExp.exec(text)) != null) {
			const offset = match.index;
			const length = match[0].length;

			const range = Range.create(document.positionAt(offset), document.positionAt(offset + length));
			const color = parseColor(text, offset);
			colorInfos.push({ color, range });
		}
	}

	return colorInfos;
}

function getColorPresentation(color: Color, range: Range) {
	const result: ColorPresentation[] = [];
	const red256 = Math.round(color.red * 255), green256 = Math.round(color.green * 255), blue256 = Math.round(color.blue * 255);

	function toTwoDigitHex(n: number): string {
		const r = n.toString(16);
		return r.length !== 2 ? '0' + r : r;
	}

	const label = `#${toTwoDigitHex(red256)}${toTwoDigitHex(green256)}${toTwoDigitHex(blue256)}`;
	result.push({ label: label, textEdit: TextEdit.replace(range, label) });

	return result;
}


const enum CharCode {
	Digit0 = 48,
	Digit9 = 57,

	A = 65,
	F = 70,

	a = 97,
	f = 102,
}

function parseHexDigit(charCode: CharCode): number {
	if (charCode >= CharCode.Digit0 && charCode <= CharCode.Digit9) {
		return charCode - CharCode.Digit0;
	}
	if (charCode >= CharCode.A && charCode <= CharCode.F) {
		return charCode - CharCode.A + 10;
	}
	if (charCode >= CharCode.a && charCode <= CharCode.f) {
		return charCode - CharCode.a + 10;
	}
	return 0;
}

function parseColor(content: string, offset: number): Color {
	const r = (16 * parseHexDigit(content.charCodeAt(offset + 1)) + parseHexDigit(content.charCodeAt(offset + 2))) / 255;
	const g = (16 * parseHexDigit(content.charCodeAt(offset + 3)) + parseHexDigit(content.charCodeAt(offset + 4))) / 255;
	const b = (16 * parseHexDigit(content.charCodeAt(offset + 5)) + parseHexDigit(content.charCodeAt(offset + 6))) / 255;
	return Color.create(r, g, b, 1);
}

function resolveIncludePath(textDocumentUri: string, includeStatementUri: string): string {
	//FIXME: currently we only resolve the include uri's as "Script directory" includes. Implementation need for "User-defined libraries" and "Standard library".
	// An extra parameter indicating starting from script or standard library when looking for the file is needed.
	// This may hovever not be needed in the webworker version?
	return Utils.resolvePath(Utils.dirname(URI.parse(textDocumentUri)), includeStatementUri).toString();
}
