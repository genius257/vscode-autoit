/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';

import { Color, ColorInformation, Range, InitializeParams, InitializeResult, ServerCapabilities, TextDocuments, ColorPresentation, TextEdit, TextDocumentIdentifier, CompletionItem, CompletionItemKind, VersionedTextDocumentIdentifier, DidChangeTextDocumentParams, TextDocumentSyncKind, DocumentLinkParams, DocumentLink, CompletionParams, DefinitionParams, LocationLink, DocumentSymbolParams, DocumentSymbol, SymbolKind } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { URI, Utils } from 'vscode-uri';

import FileAstMap from './FileAstMap';

import nativeSuggestions from "./autoit/internal";
import { Program, StatementList, SyntaxError } from 'autoit3-pegjs';
import Parser from './autoit/Parser';

console.log('running server lsp-web-extension-sample');

/* browser specific setup code */

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

/* from here on, all code is non-browser specific and could be shared with a regular extension */

let Autoit3Ast = null;

//connection.onDidChangeTextDocument((params: DidChangeTextDocumentParams) => console.log(params.contentChanges));

connection.onInitialize((params: InitializeParams): InitializeResult => {
	const capabilities: ServerCapabilities = {
		completionProvider: {
			resolveProvider: false,
			triggerCharacters: ['$'],
			//triggerCharacters: [ '.' ]
		},
		definitionProvider: {
			workDoneProgress: false,
		},
		documentLinkProvider: {
			resolveProvider: false
		},
		hoverProvider: {
			workDoneProgress: false,
		},
		documentSymbolProvider: {
			workDoneProgress: false,
		},
		textDocumentSync: TextDocumentSyncKind.Full,
	};
	return { capabilities };
});

// Track open, change and close text document events
const documents = new TextDocuments(TextDocument);
documents.listen(connection);

const fileAstMap = new FileAstMap();
connection.onDidOpenTextDocument(params => {
	try {
		fileAstMap.add(params.textDocument.uri, fileAstMap.parse(params.textDocument.text, params.textDocument.uri));
		connection.sendDiagnostics({
			uri: params.textDocument.uri,
			diagnostics: [],
		});
	} catch (error) {
		fileAstMap.add(params.textDocument.uri, fileAstMap.parse("", params.textDocument.uri));
		if (!isSyntaxError(error)) {throw error;}
		connection.sendDiagnostics({
			uri: params.textDocument.uri,
			diagnostics: [{
				message: error.message,
				range: Parser.locationToRange(error.location),
			}]
		});
	}
});

connection.onDidChangeTextDocument(params => {
	try {
		let ast: Program;
		try {
			ast = fileAstMap.parse(params.contentChanges[0].text, params.textDocument.uri);
		} catch (error) {
			if (!isSyntaxError(error)) {throw error;}
			try {
				ast = fileAstMap.parse(params.contentChanges[0].text.substring(0, error.location.start.offset-1), params.textDocument.uri);
			} catch (_error) {
				throw error;
			}
		}
		fileAstMap.add(params.textDocument.uri, ast);
		connection.sendDiagnostics({
			uri: params.textDocument.uri,
			diagnostics: [],
		});
	} catch (error) {
		fileAstMap.add(params.textDocument.uri, fileAstMap.parse("", params.textDocument.uri));
		if (isSyntaxError(error)) {
			connection.sendDiagnostics({
				uri: params.textDocument.uri,
				diagnostics: [{
					message: error.message,
					range: Parser.locationToRange(error.location),
				}]
			});
		}
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
connection.onDocumentSymbol(getDocumentSymbol);
connection.onDefinition(getDefinition);
connection.onCompletion(getCompletionItems);

connection.onDocumentLinks((params: DocumentLinkParams) => {
	const documentText = documents.get(params.textDocument.uri)?.getText();
	//const ast:{body?: Autoit3AstNode[]} = documentText !== undefined ? parser.parse(documentText) : [];
	const ast = fileAstMap.get(params.textDocument.uri);
	//connection.console.info(params.textDocument.uri);
	//URI.parse(params.textDocument.uri)

	return ast.body.reduce<DocumentLink[]>((previousValue: DocumentLink[], currentValue) => {
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
					target: resolveIncludePath(params.textDocument.uri, currentValue.file || "."), //TODO: if resolve fails, we should either mark a warning/notice of missing file, and/or not show a broken link.
				});
				break;
			default:
				break;
		}

		return previousValue;
	}, []);
});

connection.onHover((hoverParams, token, workDoneProgress) => {
	const uri = hoverParams.textDocument.uri;

	//FIXME: use hoverParams.position to find identifier or varaible.
	//hoverParams.position
	//workDoneProgress.done();
	//return null;
	//const path = resolveIncludePath(hoverParams.textDocument.uri, ".");

	const identifierAtPos = fileAstMap.getIdentifierAt(hoverParams.textDocument.uri, hoverParams.position.line + 1, hoverParams.position.character + 1);
	if (identifierAtPos === null) {
		return null;
	}

	if (identifierAtPos.type === "Identifier") {
		const suggestion = nativeSuggestions[identifierAtPos.name.toLowerCase() ?? ""];
		if (suggestion !== undefined) {
			return {
				//code: 0,
				contents: suggestion.detail + "\n\n" + suggestion.documentation,
				//message: "message",
				name: suggestion.detail,
			};
		}
	}

	//const identifier = fileAstMap.getIdentifierDeclarator(uri, identifierAtPos);
	const identifier = fileAstMap.getIdentifierDeclarator(uri, identifierAtPos);
	if (!identifier) {
		return null;
	}

	let value: string | number | boolean | null | undefined;
	if (identifier.type === "VariableDeclarator") {
		if (identifier.init?.type === "Literal") {
			value = identifier.init.value;
		}
	}
	return {
		contents: (identifierAtPos.type === "VariableIdentifier" ? "$" : "") + (identifier.id.name ?? "") + (value === undefined ? "" : " = " + value),
	};
});

// Listen on the connection
connection.listen();

function getDocumentSymbol(params: DocumentSymbolParams): DocumentSymbol[] {
	const symbols: DocumentSymbol[] = [];

	const map = fileAstMap.getMap(params.textDocument.uri);
/*
	Object.keys(map.scopes).forEach(scopeKey => {
		const scope = map.scopes[scopeKey];
		symbols.push({
			kind: SymbolKind.Function,
			name: scope.id.name,
			range: Parser.locationToRange(scope.location),
			selectionRange: Parser.locationToRange(scope.id.location),
			children: [],
		});
	});
*/
	Object.keys(map.identifiers.global).forEach(globalKey => {
		const global = map.identifiers.global[globalKey];
		symbols.push({
			kind: global.type === "FunctionDeclaration" ? SymbolKind.Function : SymbolKind.Variable,
			name: global.id.name,
			range: Parser.locationToRange(global.location),
			selectionRange: Parser.locationToRange(global.id.location),
		});
	});

	return symbols;
}

function getDefinition(params: DefinitionParams): LocationLink[] {
	const identifierAtPos = fileAstMap.getIdentifierAt(params.textDocument.uri, params.position.line + 1, params.position.character + 1);
	const declarator = fileAstMap.getIdentifierDeclarator(params.textDocument.uri, identifierAtPos);
	if (declarator === null) {
		return [];
	}
	const identifier = declarator.id;
	return [
		{
			targetUri: params.textDocument.uri,
			targetRange: Parser.locationToRange(declarator.location),
			targetSelectionRange: Parser.locationToRange(identifier.location),
		}
	];
}

function getCompletionItems(params: CompletionParams): CompletionItem[] {
	//const documentText = documents.get(params.textDocument.uri)?.getText();
	//params.position
	//const ast:{body?: Autoit3AstNode[]} = documentText !== undefined ? parser.parse(documentText) : [];
	const ast = fileAstMap.get(params.textDocument.uri);

	// FIXME: filter the top level function declarations and varaible declarations, extract identifiers and return the array
	//return ast.body.filter((item: { type: string; }) => item.type === "FunctionDeclaration" || item.type === "VariableDeclaration" )
	//return ast.body.filter((item: { type: string; }) => item.type === "FunctionDeclaration" ).map<CompletionItem>((item: { id: { name: string; }; }) => ({label: item.id.name, kind: CompletionItemKind.Function}));

	const astItems = ast.body?.reduce<CompletionItem[]>((previousValue: CompletionItem[], currentValue) => {
		// FIXME: we need to extract global variable declarations from FunctionDeclaration statements.
		// FIXME: keep a ref map, to check if var is already defined, to only show one suggestion of the same variable multiple times.
		// FIXME: show scope information in the completion item detail text.

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
							insertText: "$" + declaration.id.name, //FIXME: this need to have start of string removed equal to current typed in string.
							documentation: "documentation",
							detail: "detail",
							commitCharacters: ['$'],
						});
					}
				});
				break;
			default:
				break;
		}

		return previousValue;
	}, []) || [];

	return astItems.concat(Object.keys(nativeSuggestions).map<CompletionItem>(nativeSuggestion => ({
		label: nativeSuggestions[nativeSuggestion].title || "",
		kind: CompletionItemKind.Function,
		documentation: nativeSuggestions[nativeSuggestion].documentation,
		detail: nativeSuggestions[nativeSuggestion].detail,
	})));
}

/**
 * Extracts completion items from function declation and nested elemenets within, containing completion items.
 * This is needed to get things in current scope, within functions.
 */
function extractCompletionItems(nodes: StatementList): CompletionItem[] {
	return nodes.reduce((previousValue: CompletionItem[], currentValue) => {
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

function isSyntaxError(e: any): e is SyntaxError {
	return 'location' in e && 'expected' in e && 'found' in e && 'format' in e;
}
