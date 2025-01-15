/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';

import { /*Color, ColorInformation, Range,*/ InitializeParams, InitializeResult, ServerCapabilities, /*TextDocuments,*/ CompletionItem, CompletionItemKind, TextDocumentSyncKind, DocumentLinkParams, DocumentLink, CompletionParams, DefinitionParams, LocationLink, DocumentSymbolParams, DocumentSymbol, SymbolKind, SignatureHelp, SignatureHelpParams, ParameterInformation, Hover, Range, MarkupKind, MarkupContent } from 'vscode-languageserver';
// import { TextDocument } from 'vscode-languageserver-textdocument';

import { URI } from 'vscode-uri';

import nativeSuggestions from "./autoit/internal";
import { CallExpression, EnumDeclaration, FormalParameter, FunctionDeclaration, Identifier, IncludeStatement, LocationRange, Macro, SingleLineComment, VariableDeclaration, VariableIdentifier } from 'autoit3-pegjs';
import Parser from './autoit/Parser';
import PositionHelper from './autoit/PositionHelper';
import { AutoIt3Configuration, Workspace } from './autoit/Workspace';
import { NodeFilterAction } from './autoit/Script';
import DocBlockFactory from './autoit/docBlock/DocBlockFactory';
import InvalidTag from './autoit/docBlock/DocBlock/Tags/InvalidTag';
import MarkdownFormatter from './autoit/docBlock/DocBlock/Tags/Formatter/MarkdownFormatter';

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
// This currently does not work! Maybe caused by current dependency version or a limitation for a JS worker script LSP?
// const documents = new TextDocuments(TextDocument);
// documents.listen(connection);

const workspace = new Workspace(connection);
workspace.onDiagnostics(function (uri, diagnostics) {
    //connection.window.showWarningMessage("onDiagnostics");
    connection.sendDiagnostics({
        uri,
        diagnostics,
    });
})

connection.onDidOpenTextDocument(params => {
	workspace.createOrUpdate(params.textDocument.uri, params.textDocument.text);
});

connection.onDidChangeTextDocument(params => {
	const content = params.contentChanges[0];

	if (content === undefined) {
		return;
	}

    workspace.createOrUpdate(params.textDocument.uri, content.text);
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
				character: Math.max(0, statement.location.end.column - statement.file.length - 3)
			},
			end: {
				line: statement.location.end.line - 1,
				character: statement.location.end.column - 1
			}
		});
		return Promise
			.all(includes.map(include => include.promise))
			.then<DocumentLink[]>(() => includes.filter(include => !/^autoit3doc:/.test(include.uri??'') && include.uri !== null).map<DocumentLink>(include => ({
				range: statementToRange(include.statement),
				target: include.uri ?? undefined,
				tooltip: include.uri === null ? undefined : URI.parse(include.uri).fsPath
			})));
	} else {
		return [];
	}
});

connection.onHover((hoverParams, token, workDoneProgress):Hover|null => {
	const script = workspace.get(hoverParams.textDocument.uri);
	if (script === undefined) {
		return null;
	}

	const nodesAt = script.getNodesAt(hoverParams.position);
	nodesAt.reverse();

	if (nodesAt[0]?.type === "ExitStatement") {
		return {
			contents: {
				kind: MarkupKind.Markdown,
				value: [
					"```au3",
					"Exit ( $return_code = 0 )",
					"```",
					"Terminates the script.",
				].join("\n"),
			},
			range: PositionHelper.locationRangeToRange(nodesAt[0].location),
		};
	}

	const identifierAtPos = nodesAt.find((node):node is Identifier|VariableIdentifier|Macro => node.type === "Identifier" || node.type === "VariableIdentifier" || node.type === "Macro");
	if (identifierAtPos === undefined) {
		return null;
	}

	if (identifierAtPos.type === "Identifier" || identifierAtPos.type === "Macro") {
		const suggestion = identifierAtPos.type === "Identifier" ? nativeSuggestions[identifierAtPos.name.toLowerCase()] : nativeSuggestions[identifierAtPos.value.toLowerCase()];
		if (suggestion !== undefined) {
			return {
				contents: { kind: MarkupKind.Markdown, value: suggestion.detail + "\n\n" + suggestion.documentation } satisfies MarkupContent,
				range: PositionHelper.locationRangeToRange(identifierAtPos.location),
			};
		}
	}

	let identifier: FormalParameter | FunctionDeclaration | VariableDeclaration | EnumDeclaration | null | undefined = null;

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
				range: PositionHelper.locationRangeToRange(identifierAtPos.location),
			};
		case "FunctionDeclaration":
			const hoverContents: MarkupContent =
				{
					kind: MarkupKind.Markdown,
					value: `\`\`\`au3\nFunc ${identifier.id.name}(${Parser.AstArrayToStringArray(identifier.params).join(", ")})\n\`\`\``,
				};

			const identifierScript = workspace.get(identifier.location.source);
			if (identifierScript !== undefined) {
				const precedingIdentifierSiblings = identifierScript.filterNodes((node) => {
					if (node.location.end.line >= identifier!.location.start.line) {
						return NodeFilterAction.StopAndSkip;
					}

					if (node.type === 'EmptyStatement') {
						return NodeFilterAction.SkipAndStopPropagation;
					}

					return NodeFilterAction.StopPropagation;
				});

				const previousIdentifierSibling = precedingIdentifierSiblings[precedingIdentifierSiblings.length - 1];
				switch(previousIdentifierSibling?.type) {
					case 'MultiLineComment':
						// FIXME: move docblock parsing to script analysis instead
						try {
							const docBlock = DocBlockFactory.createInstance().createFromMultilineComment(previousIdentifierSibling);
							const markdownFormatter = new MarkdownFormatter();
							hoverContents.value += `\n\n${[docBlock.summary, docBlock.description.toString(), docBlock.tags.map(tag => {
									if (tag instanceof InvalidTag) {
										connection.console.error(`${tag.getException()}`);
										return null;
									}
									return `${tag.render(markdownFormatter)}`;
								}).join("\n\n")].join("\n\n")}`;
						} catch (e) {
							connection.console.error(`${e}`);
						}
						break;
					case 'SingleLineComment':
						const comments: SingleLineComment[] = [previousIdentifierSibling];

						for (let index = precedingIdentifierSiblings.length - 2; index >= 0; index--) {
							const element = precedingIdentifierSiblings[index]!;
							if (element.type !== "SingleLineComment") {
								break;
							}
							
							comments.unshift(element);
						}

						if (comments.length >= 3) { // A minunum of 3 lines are needed for legacy UDF function header
							const docBlock = DocBlockFactory.createInstance().createFromLegacyComments(comments);

							if (docBlock !== null) {
								hoverContents.value += `\n\n${[docBlock.summary, docBlock.description.toString()].join("\n\n")}`;
							}
						}
						break;
				}
			}

			return {
				contents: hoverContents,
				range: PositionHelper.locationRangeToRange(identifierAtPos.location),
			};
		case "Parameter":
			let parameterValue: string | number | boolean | null | undefined;
			if (identifier.init !== null) {
				parameterValue = Parser.AstToString(identifier.init);
			}
			return {
				contents: "(parameter) $" + identifier.id.name + (parameterValue === undefined ? "" : " = " + parameterValue),
				range: PositionHelper.locationRangeToRange(identifierAtPos.location),
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
				range: PositionHelper.locationRangeToRange(declaration.location),
				selectionRange: PositionHelper.locationRangeToRange(declaration.id.location),
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
			targetRange: PositionHelper.locationRangeToRange(declarator.location),
			targetSelectionRange: PositionHelper.locationRangeToRange(identifier.location),
		}
	];
}

async function getCompletionItems(params: CompletionParams): Promise<CompletionItem[]> {
	let completionItems: CompletionItem[] = [];
	const includes: string[] = [params.textDocument.uri];
	const configuration: AutoIt3Configuration = await connection.workspace.getConfiguration("autoit3");

	// Loop though all unique included files and add completion items found in each.
	for (let index = 0; index < includes.length; index++) {
		let script = workspace.get(includes[index]!);
		if (script !== undefined) {
			let _completionItems = script.declarations.reduce<CompletionItem[]>((completionItems, declaration) => {
				if (configuration.ignoreInternalInIncludes && declaration.id.name.startsWith("__")) {
					// If the declaration is an internal variable and the setting is true for ignoring those, we return early.
					return completionItems;
				}

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
	completionItems = completionItems.concat(Object.entries(nativeSuggestions).map<CompletionItem>(([key, nativeSuggestion]) => ({
		label: nativeSuggestion.title,
		kind: nativeSuggestion.kind,
		documentation: nativeSuggestion.documentation !== undefined ? {kind: MarkupKind.Markdown, value: nativeSuggestion.documentation} : undefined,
		// detail: nativeSuggestion.detail,
		// labelDetails: {description: nativeSuggestion.detail},
	})));

	return completionItems;
}

function getSignatureHelp(params: SignatureHelpParams): SignatureHelp | null
{
	const script = workspace.get(params.textDocument.uri);
	if (script === undefined) {
		return null;
	}

	const nodesAt = script.getNodesAt(params.position);
	if (nodesAt === undefined) {
		return null;
	}

	const callExpression = nodesAt.reverse().find((node):node is CallExpression => node.type === "CallExpression");
	if (callExpression === undefined) {
		return null;
	}

	const text = script.getText();
	if (text === undefined) {
		return null;
	}

	let parameterIndex: number|null = null;

	if (callExpression.arguments.length > 0) {
		// Make new array of deep cloned location ranges, to prevent modifying original AST location values.
		const argumentLocations = callExpression.arguments.map<LocationRange>(argument => JSON.parse(JSON.stringify(argument.location)));
		let textBetween = text.substring(callExpression.callee.location.end.offset, argumentLocations[0]!.start.offset);
		let parenthesisIndex = textBetween.indexOf('(');
		argumentLocations[0]!.start = PositionHelper.offsetToLocation(argumentLocations[0]!.start.offset - Math.abs((textBetween.length - 1) - parenthesisIndex), text);
		if (argumentLocations.length > 1) {
			for (let index = 0; index < argumentLocations.length - 1; index++) {
				const argumentLeft = argumentLocations[index]!;
				const argumentRight = argumentLocations[index + 1]!;
				const textBetween = text.substring(argumentLeft.end.offset, argumentRight.start.offset);
				const commaIndex = textBetween.indexOf(',');
				argumentLeft.end = PositionHelper.offsetToLocation(argumentLeft.end.offset + commaIndex, text);
				argumentRight.start = PositionHelper.offsetToLocation(argumentRight.start.offset - Math.abs((textBetween.length - 1) - commaIndex), text);
			}
		}
		textBetween = text.substring(argumentLocations[argumentLocations.length - 1]!.end.offset, callExpression.location.end.offset);
		parenthesisIndex = textBetween.indexOf(')');
		argumentLocations[argumentLocations.length - 1]!.end = PositionHelper.offsetToLocation(argumentLocations[argumentLocations.length - 1]!.end.offset + parenthesisIndex, text);

		parameterIndex = argumentLocations.findIndex(location => PositionHelper.isPositonWithinLocationRange(params.position, location));
	}

	if (params.context?.isRetrigger && params.context.activeSignatureHelp !== undefined) {
		if (callExpression.arguments.length > 0) {
			if (parameterIndex === -1) {
				return null;
			}

			if (params.context.activeSignatureHelp.activeParameter !== undefined && parameterIndex !== -1){
				params.context.activeSignatureHelp.activeParameter = parameterIndex ?? undefined;
			}
		} else {
			params.context.activeSignatureHelp.activeParameter = undefined;
		}

		return params.context.activeSignatureHelp;
	}

	//FIXME: this currently won't work for member expressions!

	if (callExpression.callee.type === "ExpressionStatement" || callExpression.callee.type === "Macro" || callExpression.callee.type === "MemberExpression" || callExpression.callee.type === "Literal" || callExpression.callee.type === "Keyword") {
		return null;
	}

	const declarator = script.getIdentifierDeclarator(callExpression.callee);
	if (!declarator) {
		return null;
	}

	if (declarator === null || declarator.type === "VariableDeclarator" || declarator.type === "Parameter") {//FIXME: currently we don't look for identifier in the VariableDeclarator init!
		return null;
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
		activeParameter: parameterIndex ?? undefined,
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
