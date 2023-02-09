/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';

import { /*Color, ColorInformation, Range,*/ InitializeParams, InitializeResult, ServerCapabilities, TextDocuments, /*ColorPresentation, TextEdit, TextDocumentIdentifier,*/ CompletionItem, CompletionItemKind, TextDocumentSyncKind, DocumentLinkParams, DocumentLink, CompletionParams, DefinitionParams, LocationLink, DocumentSymbolParams, DocumentSymbol, SymbolKind, SignatureHelp, SignatureHelpParams, ParameterInformation, Hover, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { URI } from 'vscode-uri';

import nativeSuggestions from "./autoit/internal";
import { CallExpression, EnumDeclaration, FormalParameter, FunctionDeclaration, Identifier, IncludeStatement, Macro, StatementList, VariableDeclaration, VariableIdentifier } from 'autoit3-pegjs';
import Parser from './autoit/Parser';
import { Workspace } from './autoit/Workspace';
import Script, { NodeFilterAction } from './autoit/Script';

console.log('running server autoit3-lsp-web-extension');

/* browser specific setup code */

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

/* from here on, all code is non-browser specific and could be shared with a regular extension */

//connection.onDidChangeTextDocument((params: DidChangeTextDocumentParams) => console.log(params.contentChanges));
connection.onInitialize((params: InitializeParams): InitializeResult => {
	const capabilities: ServerCapabilities = {
		completionProvider: {
			resolveProvider: false,
			triggerCharacters: ['$', '.', '@'],
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
			triggerCharacters: ['(', ','],
			retriggerCharacters: [','],
			workDoneProgress: false,
		},
		textDocumentSync: TextDocumentSyncKind.Full,
	};
	return { capabilities };
});

// Track open, change and close text document events
const documents = new TextDocuments(TextDocument);
documents.listen(connection);

function debounce<F extends Function>(cb: F, delay = 250) {
	let timeout
  
	return <F>(<any>((...args) => {
	  clearTimeout(timeout)
	  timeout = setTimeout(() => {
		cb(...args)
	  }, delay)
	}));
  }

const workspace = new Workspace(connection);
workspace.onDiagnostics(debounce(function (uri, diagnostics) {
    //connection.window.showWarningMessage("onDiagnostics");
    connection.sendDiagnostics({
        uri,
        diagnostics,
    });
}, 100))

connection.onDidOpenTextDocument(params => {
	workspace.createOrUpdate(params.textDocument.uri, params.textDocument.text);
});

connection.onDidChangeTextDocument(params => {
    workspace.createOrUpdate(params.textDocument.uri, params.contentChanges[0].text);
});

connection.onDidCloseTextDocument(params => {
	workspace.get(params.textDocument.uri)?.release();
});

// Register providers
//connection.onDocumentColor(params => getColorInformation(params.textDocument));
//connection.onColorPresentation(params => getColorPresentation(params.color, params.range));
connection.onDocumentSymbol(getDocumentSymbol);
connection.onDefinition(getDefinition);
connection.onCompletion(getCompletionItems);
connection.onSignatureHelp(getSignatureHelp);

connection.onDocumentLinks((params: DocumentLinkParams) => {
	//const documentText = documents.get(params.textDocument.uri)?.getText();

	const includes = workspace.get(params.textDocument.uri)?.getIncludes();
	if (includes !== undefined) {
		const statementToRange = (statement: IncludeStatement): Range => ({
			start: {
				line: statement.location.start.line - 1,
				character: statement.location.end.column - statement.file.length - 3
			},
			end: {
				line: statement.location.end.line - 1,
				character: statement.location.end.column - 1
			}
		});
		return Promise
			.all(includes.map(include => include.promise))
			.then<DocumentLink[]>(() => includes.map<DocumentLink>(include => ({
				range: statementToRange(include.statement),
				target: include.uri ?? undefined,
				tooltip: include.uri === null ? undefined : URI.parse(include.uri).fsPath
			})));
	} else {
		return [];
	}
});

connection.onHover((hoverParams, token, workDoneProgress):Hover|null => {
	const nodesAt = workspace.get(hoverParams.textDocument.uri)?.getNodesAt(hoverParams.position);
	nodesAt?.reverse();

	if (nodesAt?.[0]?.type === "ExitStatement") {
		connection.console.log(JSON.stringify(nodesAt[0]));
		return {
			contents: "Exit ( [return code] )\n\nTerminates the script.",
			range: Parser.locationToRange(nodesAt[0].location),
		};
	}

	const identifierAtPos = nodesAt?.find((node):node is Identifier|VariableIdentifier|Macro => node.type === "Identifier" || node.type === "VariableIdentifier" || node.type === "Macro");
	if (identifierAtPos === undefined) {
		return null;
	}

	if (identifierAtPos.type === "Identifier" || identifierAtPos.type === "Macro") {
		const suggestion = identifierAtPos.type === "Identifier" ? nativeSuggestions[identifierAtPos.name.toLowerCase()] : nativeSuggestions[identifierAtPos.value.toLowerCase()];
		if (suggestion !== undefined) {
			return {
				contents: suggestion.detail + "\n\n" + suggestion.documentation,
				range: Parser.locationToRange(identifierAtPos.location),
			};
		}
	}

	let identifier: FormalParameter | FunctionDeclaration | VariableDeclaration | null | undefined = null;
	//conditional block to check for variable declaritions within a function scope.
	if (identifierAtPos.type === "VariableIdentifier") {
		const functionDeclaration: FunctionDeclaration | undefined = nodesAt?.find((node): node is FunctionDeclaration => node.type === "FunctionDeclaration");
		if (functionDeclaration !== undefined) {
			const script = new Script("");
			const variableDeclaratorsInScope: Array<VariableDeclaration|EnumDeclaration> = [];
			script.filterNestedNode(functionDeclaration, (node) => node.type === "VariableDeclarator" && node.id.name.toLowerCase() === identifierAtPos.name.toLowerCase() ? NodeFilterAction.StopPropagation : NodeFilterAction.Skip, variableDeclaratorsInScope);
			//script.filterNestedNode(functionDeclaration, (node) => {connection.console.log(node.type);return /*node.type === "VariableDeclarator" ? NodeFilterAction.StopPropagation :*/ NodeFilterAction.Continue}, variableDeclaratorsInScope);
			identifier = variableDeclaratorsInScope.filter(variableDeclarator => identifierAtPos.location.start.offset > variableDeclarator.location.end.offset).reverse()[0];
			if (!identifier) {
				//fallback to check function parameters, if no identifier was found.
				identifier = functionDeclaration.params.filter(param => param.id.name.toLowerCase() === identifierAtPos.name.toLowerCase())[0];
			}
		}
	}

	identifier = identifier ?? workspace.get(hoverParams.textDocument.uri)?.getIdentifierDeclarator(identifierAtPos);
	if (!identifier) {
		return null;
	}

	switch (identifier.type) {
		case "VariableDeclarator":
			let value: string | number | boolean | null | undefined;
			if (identifier.init !== null) {
				value = Parser.AstToString(identifier.init);
			}

			return {
				contents: (identifierAtPos.type === "VariableIdentifier" ? "$" : "") + identifier.id.name + (value === undefined ? "" : " = " + value),
				range: Parser.locationToRange(identifierAtPos.location),
			};
		case "FunctionDeclaration":
			return {
				contents: identifier.id.name+"("+Parser.AstArrayToStringArray(identifier.params).join(", ")+")",
				range: Parser.locationToRange(identifierAtPos.location),
			};
		case "Parameter":
			let parameterValue: string | number | boolean | null | undefined;
			if (identifier.init !== null) {
				parameterValue = Parser.AstToString(identifier.init);
			}
			return {
				contents: "(parameter) $" + identifier.id.name + (parameterValue === undefined ? "" : " = " + parameterValue),
				range: Parser.locationToRange(identifierAtPos.location),
			};
		default:
			break;
	}

	return null;
});

// Listen on the connection
connection.listen();

function getDocumentSymbol(params: DocumentSymbolParams): DocumentSymbol[] {
	const symbols: DocumentSymbol[] = [];

	workspace.get(params.textDocument.uri)?.filterNodes((node) => node.type === "FunctionDeclaration" || node.type === "VariableDeclarator" ? NodeFilterAction.StopPropagation : NodeFilterAction.Skip).forEach((declaration) => {
		if (declaration.type === "FunctionDeclaration" || declaration.type === "VariableDeclarator") {
			symbols.push({
				kind: declaration.type === "FunctionDeclaration" ? SymbolKind.Function : SymbolKind.Variable,
				name: declaration.id.name,
				range: Parser.locationToRange(declaration.location),
				selectionRange: Parser.locationToRange(declaration.id.location),
			});
		}
	})

	return symbols;
}

function getDefinition(params: DefinitionParams): LocationLink[] {

	const nodesAt = workspace.get(params.textDocument.uri)?.getNodesAt(params.position);
	const identifierAtPos = nodesAt?.reverse().find((node):node is Identifier|VariableIdentifier|Macro => node.type === "Identifier" || node.type === "VariableIdentifier" || node.type === "Macro");
	if (identifierAtPos === undefined) {
		return [];
	}
	const declarator = workspace.get(params.textDocument.uri)?.getIdentifierDeclarator(identifierAtPos);
	if (!declarator) {
		return [];
	}
	if (declarator === null) {
		return [];
	}
	const identifier = declarator.id;
	return [
		{
			targetUri: declarator.location.source,
			targetRange: Parser.locationToRange(declarator.location),
			targetSelectionRange: Parser.locationToRange(identifier.location),
		}
	];
}

function getCompletionItems(params: CompletionParams): CompletionItem[] {
	// FIXME: filter the top level function declarations and varaible declarations, extract identifiers and return the array

	const astItems = workspace.get(params.textDocument.uri)?.filterNodes((node) => node.type === "FunctionDeclaration" || node.type === "VariableDeclaration" ? NodeFilterAction.StopPropagation : NodeFilterAction.SkipAndStopPropagation)/*ast.body?*/.reduce<CompletionItem[]>((previousValue: CompletionItem[], currentValue) => {
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
		kind: nativeSuggestions[nativeSuggestion].kind,
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

function getSignatureHelp(params: SignatureHelpParams): SignatureHelp | null
{
	if (params.context?.isRetrigger && params.context?.triggerCharacter === "," && params.context.activeSignatureHelp !== undefined) {
		if (params.context.activeSignatureHelp.activeParameter !== null){
			params.context.activeSignatureHelp.activeParameter += 1;
		}
		return params.context.activeSignatureHelp;
	}

	const nodesAt = workspace.get(params.textDocument.uri)?.getNodesAt(params.position);
	const callExpression = nodesAt?.reverse().find((node):node is CallExpression => node.type === "CallExpression");
	if (callExpression === undefined) {
		return null;
	}

	if (params.context?.isRetrigger && params.context.activeSignatureHelp !== undefined && callExpression !== null) {
		return params.context.activeSignatureHelp;
	}

	//FIXME: this currently won't work for member expressions!

	if (callExpression.callee.type === "ExpressionStatement" || callExpression.callee.type === "Macro" || callExpression.callee.type === "MemberExpression" || callExpression.callee.type === "Literal" || callExpression.callee.type === "Keyword") {
		return null;
	}

	const declarator = workspace.get(params.textDocument.uri)?.getIdentifierDeclarator(callExpression.callee);
	if (!declarator) {
		return null;
	}

	if (declarator === null || declarator.type === "VariableDeclarator" || declarator.type === "Parameter") {//FIXME: currently we don't look for identifier in the VariableDeclarator init!
		return null;
	}

	//connection.window.showInformationMessage(documents.keys().length.toString());
	const x = documents.get(params.textDocument.uri)?.getText(Parser.locationToRange(declarator.location));
	if (x !== undefined) {
		//connection.window.showInformationMessage(x);
	} else {
		//connection.window.showInformationMessage("x is undefined.");
	}

	return {
		signatures: [
			{
				label: declarator.id.name+"("+Parser.AstArrayToStringArray(declarator.params).join(", ")+")",
				documentation: undefined,//FIXME: built in funcs have this as not undefined
				parameters: declarator.params.map((parameter): ParameterInformation => ({
					label: '$'+parameter.id.name,
					documentation: undefined,//FIXME: built in funcs have this as not undefined in the future
				})),
			}
		],
		activeParameter: 0,
		activeSignature: 0,
	};
}

//const colorRegExp = /#([0-9A-Fa-f]{6})/g;

//NOTE: currently colorization is done via simple vscode tmLanguage logic, but using the parser, when ready may be a better choice. Time will tell.
/*
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
*/
