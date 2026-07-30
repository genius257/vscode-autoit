import { CompletionItem, CompletionItemKind, CompletionList, MarkupKind, Position } from 'vscode-languageserver';
import { Workspace } from '../autoit/Workspace';
import Symbol from '../autoit/Symbol';
import { isPositionWithinLocationRange } from '../autoit/PositionHelper';
import nativeSuggestions from '../autoit/internal';

const nativeCompletionItems: CompletionItem[] = Object.entries(nativeSuggestions)
    // eslint-disable-next-line @stylistic/array-bracket-newline
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

        // FIXME: filter out declarations declared AFTER the position.

        for (const scope of scopes) {
            scope.getSymbols().forEach((value, key) => symbols.set(key, value));

            if (scope.uri?.toString() !== textDocumentUri) {
                continue;
            }

            for (const subScope of scope.getSubscopes()) {
                if (subScope.range === undefined || !isPositionWithinLocationRange(position, subScope.range)) {
                    continue;
                }

                subScope.getSymbols().forEach((value, key) => symbols.set(key, value));
            }
        }

        return Array.from(symbols.values()).map<CompletionItem>((symbol) => ({
            label: symbol.name,
            kind: this.resolveCompletionItemKind(symbol),
        }))
            .concat(this.getNativeSuggestions());
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
