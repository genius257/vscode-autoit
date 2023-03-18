/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';

import { /*Color, ColorInformation, Range,*/ InitializeParams, InitializeResult, ServerCapabilities, TextDocuments, CompletionItem, CompletionItemKind, TextDocumentSyncKind, DocumentLinkParams, DocumentLink, CompletionParams, DefinitionParams, LocationLink, DocumentSymbolParams, DocumentSymbol, SymbolKind, SignatureHelp, SignatureHelpParams, ParameterInformation, Hover, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { URI } from 'vscode-uri';

import nativeSuggestions from "./autoit/internal";
import { CallExpression, FormalParameter, FunctionDeclaration, Identifier, IncludeStatement, Macro, VariableDeclaration, VariableIdentifier } from 'autoit3-pegjs';
import Parser from './autoit/Parser';
import { Workspace } from './autoit/Workspace';
import { NodeFilterAction } from './autoit/Script';

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
	let completionItems: CompletionItem[] = [];
	const includes: string[] = [params.textDocument.uri];

	// Loop though all unique included files and add completion items found in each.
	for (let index = 0; index < includes.length; index++) {
		let script = workspace.get(includes[index]);
		if (script !== undefined) {
			let _completionItems = script.declarations.reduce<CompletionItem[]>((completionItems, declaration) => {
				switch (declaration.type) {
					case "FunctionDeclaration":
						completionItems.push({
							label: declaration.id.name,
							kind: CompletionItemKind.Function,
						});
						break;
					case "VariableDeclarator":
						completionItems.push({
							label: "$" + declaration.id.name,
							kind: CompletionItemKind.Variable,
							insertText: "$" + declaration.id.name,
						});
						break;
				}
		
				return completionItems;
			}, []);
			completionItems.push(..._completionItems);
			includes.push(...script.getIncludes().map(x => x.uri).filter((x):x is string => x!==null && !includes.includes(x)));
		}
	}

	// If within a function, add everything defined before cursor as suggestions from the scope
	let script = workspace.get(params.textDocument.uri);
	if (script !== undefined) {
		const matches: Array<VariableDeclaration|FormalParameter> = [];
		script.filterNestedNode(
			script.declarations.find(declaration => declaration.type === "FunctionDeclaration" && Parser.isPositionWithinLocation(params.position.line, params.position.character, declaration.location)) ?? null,
			(node) => {
				if (node.location.start.line >= (params.position.line + 1)) {return NodeFilterAction.SkipAndStopPropagation;}
				if (node.type === "Parameter" || node.type === "VariableDeclarator") { node; return NodeFilterAction.Continue;}
				return NodeFilterAction.Skip;
			},
			matches
		);

		completionItems.push(...matches.map<CompletionItem>(match => ({label: "$" + match.id.name, kind: CompletionItemKind.Variable})));
	}

	//Filter duplicate suggestions out based on case insensetive name comparison
	completionItems = completionItems.filter((completionItem, index, array) => array.findIndex(x => x.label.toLowerCase() === completionItem.label.toLowerCase()) === index);

	//Add all native suggestions
	completionItems = completionItems.concat(Object.keys(nativeSuggestions).map<CompletionItem>(nativeSuggestion => ({
		label: nativeSuggestions[nativeSuggestion].title || "",
		kind: nativeSuggestions[nativeSuggestion].kind,
		documentation: nativeSuggestions[nativeSuggestion].documentation,
		detail: nativeSuggestions[nativeSuggestion].detail,
	})));

	return completionItems;
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
