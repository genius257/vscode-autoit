import { CompletionItem, CompletionItemKind, CompletionList, MarkupContent, MarkupKind, Position } from 'vscode-languageserver';
import { type AutoIt3, type Location } from 'autoit3-pegjs';
import { Workspace } from '../autoit/Workspace';
import Symbol from '../autoit/Symbol';
import * as PositionHelper from '../autoit/PositionHelper';
import * as Parser from '../autoit/Parser';
import { isPositionWithinLocationRange } from '../autoit/PositionHelper';
import nativeSuggestions from '../autoit/internal';

const nativeCompletionItems: CompletionItem[] = Object.entries(nativeSuggestions)
    .map(([, nativeSuggestion]) => ({
        label: nativeSuggestion.title,
        kind: nativeSuggestion.kind,
        documentation: nativeSuggestion.documentation !== undefined
            ? {
                kind: MarkupKind.Markdown,
                value: nativeSuggestion.documentation,
            }
            : undefined,

        // detail: nativeSuggestion.detail,

        // labelDetails: {description: nativeSuggestion.detail},
    }));

/**
 * Bridge between the CompletionItemProvider and the Script
 */
export class CompletionItemBridge {
    protected workpspace: Workspace;
    protected nativeSuggestions;

    public constructor(workpspace: Workspace) {
        this.workpspace = workpspace;
    }

    public resolveCompletionItems(
        textDocumentUri: string,
        position: Position,
    ): CompletionItem[] | CompletionList | undefined | null {
        const scopes = this.workpspace.getScopes(textDocumentUri);
        const symbols = new Map<string, Symbol>();
        const cursorLocation = PositionHelper.positionToLocation(position);
        const cursorScope = this.workpspace.get(textDocumentUri)?.getScopeAtPosition(position);
        const isCursorInFunction = cursorScope !== undefined && !cursorScope.isGlobal();

        for (const scope of scopes) {
            const isCurrentDocument = scope.uri?.toString() === textDocumentUri;
            const isGlobalScope = scope.isGlobal();

            for (const [key, symbol] of scope.getSymbols()) {
                if (isCurrentDocument && !this.isSymbolAvailableAtPosition(symbol, textDocumentUri, cursorLocation, isCursorInFunction, isGlobalScope)) {
                    continue;
                }

                symbols.set(key, symbol);
            }

            if (!isCurrentDocument) {
                continue;
            }

            for (const subScope of scope.getSubscopes()) {
                if (subScope.range === undefined || !isPositionWithinLocationRange(position, subScope.range)) {
                    continue;
                }

                for (const [key, symbol] of subScope.getSymbols()) {
                    if (!this.isSymbolAvailableAtPosition(symbol, textDocumentUri, cursorLocation, isCursorInFunction, false)) {
                        continue;
                    }

                    symbols.set(key, symbol);
                }
            }
        }

        return Array.from(symbols.values())
            .map<CompletionItem>((symbol) => ({
                label: symbol.getDisplayName(),
                kind: this.resolveCompletionItemKind(symbol),
                documentation: this.resolveCompletionItemDocumentation(symbol),
            }))
            .concat(this.getNativeSuggestions());
    }

    /**
     * Determines whether a symbol can be offered for completion at the given position.
     *
     * Declarations appearing after the cursor in the same document are filtered out,
     * except:
     * - function declarations, which are hoisted in AutoIt and are therefore available
     *   before their declaration, and
     * - global declarations, which are hoisted for function bodies and are therefore
     *   available inside a function even when declared after the cursor.
     *
     * Symbols without declarations in the requested document (e.g. from includes, the
     * native library, or assignment-only symbols) are always available.
     */
    protected isSymbolAvailableAtPosition(
        symbol: Symbol,
        textDocumentUri: string,
        cursorLocation: Location,
        isCursorInFunction: boolean,
        isGlobalSymbol: boolean,
    ): boolean {
        let foundDeclarationInDocument = false;

        for (const declaration of symbol.getDeclarations()) {
            if (declaration.location.source.toString() !== textDocumentUri) {
                continue;
            }

            foundDeclarationInDocument = true;

            // A declaration at or before the cursor makes the symbol available.
            if (PositionHelper.isLocationBeforeOrEqual(declaration.location.start, cursorLocation)) {
                return true;
            }
        }

        // Symbols without declarations in the requested document are not position filtered.
        if (!foundDeclarationInDocument) {
            return true;
        }

        // Functions are hoisted in AutoIt, so they are available even when declared after the cursor.
        if (this.resolveCompletionItemKind(symbol) === CompletionItemKind.Function) {
            return true;
        }

        /*
         * Global declarations are hoisted for function bodies: a global declared after the
         * cursor is still available inside a function.
         */
        if (isCursorInFunction && isGlobalSymbol) {
            return true;
        }

        return false;
    }

    public resolveCompletionItemDocumentation(symbol: Symbol): MarkupContent | undefined {
        const declarations = [...symbol.getDeclarations()];

        if (declarations.length === 0) {
            return undefined;
        }

        const declaration = declarations[0];

        if (declaration === undefined) {
            return undefined;
        }

        const declarationScript = this.workpspace.get(declaration.location.source.toString());

        if (declarationScript === undefined) {
            return undefined;
        }

        const position = PositionHelper.locationToPosition(declaration.location.start);
        const declarationNodes = declarationScript.getNodesAt(position);
        declarationNodes.reverse();

        const declarator = declarationNodes.find((node): node is AutoIt3.VariableDeclaration | AutoIt3.FunctionDeclaration | AutoIt3.FormalParameter => node.type === 'VariableDeclarator' || node.type === 'FunctionDeclaration' || node.type === 'Parameter');

        if (declarator === undefined) {
            return undefined;
        }

        let value = '';

        switch (declarator.type) {
            case 'VariableDeclarator':
            {
                let initValue: string | null = null;

                if (declarator.init !== null) {
                    initValue = Parser.AstToString(declarator.init);
                }

                const dimensions = 'dimensions' in declarator && declarator.dimensions.length > 0
                    ? '[' + declarator.dimensions.map((dimension) => Parser.AstToString(dimension)).join('][') + ']'
                    : '';

                value = `\`\`\`au3\n${declaration.type === 'VariableIdentifier' ? '$' : ''}${declarator.id.name}${dimensions}${initValue === null ? '' : ' = ' + initValue}\n\`\`\``;

                const variableDocBlock = symbol.getDocblocks().get(declaration);

                if (variableDocBlock !== undefined) {
                    value += `\n\n${variableDocBlock.summary.toString()}\n\n${variableDocBlock.description.toString()}\n\n${variableDocBlock.tags.map((tag) => tag.render()).join('\n\n')}`;
                }

                break;
            }
            case 'FunctionDeclaration':
            {
                value = `\`\`\`au3\nFunc ${declarator.id.name}(${Parser.AstArrayToStringArray(declarator.params).join(', ')})\n\`\`\``;

                const docBlock = symbol.getDocblocks().get(declaration);

                if (docBlock !== undefined) {
                    value += `\n\n${docBlock.summary.toString()}\n\n${docBlock.description.toString()}\n\n${docBlock.tags.map((tag) => tag.render()).join('\n\n')}`;
                }

                break;
            }
            case 'Parameter':
            {
                const parameterValue = declarator.init !== null ? Parser.AstToString(declarator.init) : null;

                value = `\`\`\`au3\n(parameter) $${declarator.id.name}${parameterValue === null ? '' : ' = ' + parameterValue}\n\`\`\``;

                break;
            }
            default:
                return undefined;
        }

        return {
            kind: MarkupKind.Markdown,
            value,
        };
    }

    public resolveCompletionItemKind(symbol: Symbol): CompletionItemKind {
        for (const declaration of symbol.getDeclarations()) {
            switch (declaration.type) {
                case 'Identifier':
                    return CompletionItemKind.Function;
                case 'VariableIdentifier':
                    return CompletionItemKind.Variable;
                case 'Macro':
                    return CompletionItemKind.Constant;
                default:
                    break;
            }
        }

        return CompletionItemKind.Variable;
    }

    public getNativeSuggestions() {
        return nativeCompletionItems;
    }
}
