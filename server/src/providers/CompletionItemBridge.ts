import { CompletionItem, CompletionItemKind, CompletionList, MarkupContent, MarkupKind, Position } from 'vscode-languageserver';
import { type AutoIt3, type Location } from 'autoit3-pegjs';
import { URI, Utils } from 'vscode-uri';
import { relativePath } from '../autoit/Path';
import { Workspace } from '../autoit/Workspace';
import Symbol from '../autoit/Symbol';
import * as PositionHelper from '../autoit/PositionHelper';
import * as Parser from '../autoit/Parser';
import { isPositionWithinLocationRange } from '../autoit/PositionHelper';
import nativeSuggestions from '../autoit/internal';
import { getScopeLabel } from '../autoit/DeclarationScope';
import buildSignatureLabel from '../utils/signatureParams';

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
 * Lowercase titles of all native suggestions, so workspace symbols clashing
 * with a native name are not offered additionally.
 */
const nativeNames = new Set(Object.values(nativeSuggestions).map((nativeSuggestion) => nativeSuggestion.title.toLowerCase()));

/**
 * Case-insensitive subsequence match: every character of `prefix` must appear
 * in `label` in the same order.
 */
function isFuzzyMatch(prefix: string, label: string): boolean {
    const lowerLabel = label.toLowerCase();
    const lowerPrefix = prefix.toLowerCase();

    let index = 0;

    for (const char of lowerPrefix) {
        index = lowerLabel.indexOf(char, index);

        if (index === -1) {
            return false;
        }

        index++;
    }

    return true;
}

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

        const items = Array.from(symbols.values())
            .map<CompletionItem>((symbol) => ({
                label: symbol.getDisplayName(),
                kind: this.resolveCompletionItemKind(symbol),
                documentation: this.resolveCompletionItemDocumentation(symbol),
            }));

        const nativeItems = this.getNativeSuggestions();
        const workspaceItems = this.getWorkspaceSuggestions(textDocumentUri, position, symbols);

        return [
            ...items,
            ...nativeItems,
            ...workspaceItems,
        ];
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

                const scopeLabel = getScopeLabel(declarationScript, declaration);

                value = `\`\`\`au3\n${scopeLabel === undefined ? '' : `(${scopeLabel}) `}${declaration.type === 'VariableIdentifier' ? '$' : ''}${declarator.id.name}${dimensions}${initValue === null ? '' : ' = ' + initValue}\n\`\`\``;

                const variableDocBlock = symbol.getDocblocks().get(declaration);

                if (variableDocBlock !== undefined) {
                    value += `\n\n${variableDocBlock.summary.toString()}\n\n${variableDocBlock.description.toString()}\n\n${variableDocBlock.tags.map((tag) => tag.render()).join('\n\n')}`;
                }

                break;
            }
            case 'FunctionDeclaration':
            {
                value = `\`\`\`au3\n${buildSignatureLabel(`Func ${declarator.id.name}`, Parser.AstArrayToStringArray(declarator.params)).label}\n\`\`\``;

                const docBlock = symbol.getDocblocks().get(declaration);

                if (docBlock !== undefined) {
                    value += `\n\n${docBlock.summary.toString()}\n\n${docBlock.description.toString()}\n\n${docBlock.tags.map((tag) => tag.render()).join('\n\n')}`;
                }

                break;
            }
            case 'Parameter':
            {
                const parameterValue = declarator.init !== null ? Parser.AstToString(declarator.init) : null;
                const scopeLabel = getScopeLabel(declarationScript, declaration);

                value = `\`\`\`au3\n(parameter${scopeLabel === undefined ? '' : ', ' + scopeLabel}) $${declarator.id.name}${parameterValue === null ? '' : ' = ' + parameterValue}\n\`\`\``;

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

    /**
     * Builds completion suggestions for symbols declared in workspace files
     * that are not (yet) part of the current document's include closure.
     *
     * Flooding is avoided by:
     * - only offering symbols once at least one identifier character has been
     *   typed at the cursor (prefix gate), and
     * - demoting the items with a penalized sortText, so included, local and
     *   native suggestions always rank first.
     */
    protected getWorkspaceSuggestions(
        textDocumentUri: string,
        position: Position,
        existingSymbols: Map<string, Symbol>,
    ): CompletionItem[] {
        const configuration = this.workpspace.getConfiguration();

        if (configuration?.workspaceCompletions === false) {
            return [];
        }

        const prefix = this.getTypedPrefix(textDocumentUri, position);

        if (prefix === null || prefix.length === 0) {
            return [];
        }

        const ignoreInternal = configuration?.ignoreInternalInIncludes === true;
        const items: CompletionItem[] = [];

        for (const entry of this.workpspace.getWorkspaceSymbols()) {
            // Already offered via the document scopes or includes
            if (existingSymbols.has(entry.key) || entry.uri.toString() === textDocumentUri) {
                continue;
            }

            const displayName = entry.symbol.getDisplayName();

            if (ignoreInternal && displayName.startsWith('__')) {
                continue;
            }

            if (nativeNames.has(displayName.toLowerCase())) {
                continue;
            }

            if (!isFuzzyMatch(prefix, displayName)) {
                continue;
            }

            const targetUri = this.resolveWorkspaceSymbolUri(entry.symbol);

            if (targetUri === null) {
                continue;
            }

            const includeEdit = this.workpspace.getIncludeInsertionEdit(textDocumentUri, targetUri.toString());

            items.push({
                label: displayName,
                kind: this.resolveCompletionItemKind(entry.symbol),
                documentation: this.resolveCompletionItemDocumentation(entry.symbol),
                labelDetails: { description: this.resolveProvenance(textDocumentUri, targetUri) },
                sortText: `zzzz${displayName.toLowerCase()}`,
                additionalTextEdits: includeEdit === null
                    ? undefined
                    : [includeEdit],
            });
        }

        return items;
    }

    /**
     * Extracts the identifier characters immediately before the cursor, or
     * null when the document is unknown or the position is out of range.
     */
    protected getTypedPrefix(textDocumentUri: string, position: Position): string | null {
        const script = this.workpspace.get(textDocumentUri);

        if (script === undefined) {
            return null;
        }

        const text = script.getText();

        let offset: number;

        try {
            offset = PositionHelper.positionToOffset(position, text);
        } catch {
            return null;
        }

        const identifierPattern = /[A-Za-z0-9_$]/;
        let start = offset;

        while (start > 0 && identifierPattern.test(text[start - 1] ?? '')) {
            start--;
        }

        return text.slice(start, offset);
    }

    /**
     * Returns the URI of the file a workspace symbol is declared (or first
     * assigned) in, or null when the symbol has no located nodes.
     */
    protected resolveWorkspaceSymbolUri(symbol: Symbol): URI | null {
        const declarations = symbol.getDeclarations();
        const assignments = symbol.getAssignments();
        const node = declarations.values().next().value ??
            assignments.values().next().value;

        if (node === undefined) {
            return null;
        }

        return URI.parse(node.location.source.toString());
    }

    /**
     * Human readable source description for a workspace symbol: relative to
     * the current document when below it, otherwise the file's base name.
     */
    protected resolveProvenance(textDocumentUri: string, targetUri: URI): string {
        const relative = relativePath(Utils.dirname(URI.parse(textDocumentUri)).path, targetUri.path);

        if (!relative.startsWith('..')) {
            return relative.replace(/\//g, '\\');
        }

        return targetUri.path.split('/').pop() ?? targetUri.path;
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
}
