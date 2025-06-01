import { CompletionItem, CompletionItemKind, CompletionList, MarkupKind, Position } from 'vscode-languageserver';
import { Workspace } from '../autoit/Workspace';
import { Node, NodeFilterAction } from '../autoit/Script';
import { AutoIt3 } from 'autoit3-pegjs';
import { isPositionWithinLocation } from '../autoit/Parser';
import nativeSuggestions from '../autoit/internal';

type WhereAstTypeEquals<T extends { type: string }, S extends string> =
    T extends { type: S } ? T : never;

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
        const script = this.workpspace.get(textDocumentUri);

        if (script === undefined) {
            return;
        }

        const includes = [textDocumentUri];

        const declarationMap = new Map<string, WhereAstTypeEquals<Node, 'FunctionDeclaration' | 'VariableDeclarator' | 'Parameter'>>();

        script.declarations.forEach((declaration) => {
            const isFunction = declaration.type === 'FunctionDeclaration';

            if (
                isFunction &&
                isPositionWithinLocation(
                    position.line,
                    position.character,
                    declaration.location,
                )
            ) {
                this.getDeclarationsInFunction(declaration, position.line + 1)
                    .forEach((declaration) => {
                        // We do not check if the declaration name is already in the map, because this scope takes precedence over the global scope
                        declarationMap.set(
                            declaration.id.name.toLowerCase(),
                            declaration,
                        );
                    });
            }

            const key = isFunction ? declaration.id.name.toLowerCase() : '$' + declaration.id.name.toLowerCase();

            if (!declarationMap.has(key)) {
                declarationMap.set(key, declaration);
            }
        });

        const configuration = this.workpspace.getConfiguration();

        // Add includes
        includes.push(
            ...script.getIncludes()
                .map((include) => include.uri)
                .filter((uri) => uri !== null),
        );

        for (let index = 1; index < includes.length; index++) {
            const uri = includes[index] as string;
            const script = this.workpspace.get(uri);

            if (script === undefined) {
                continue;
            }

            script.declarations.forEach((declaration) => {
                const isFunction = declaration.type === 'FunctionDeclaration';

                if (configuration?.ignoreInternalInIncludes && declaration.id.name.startsWith('__')) {
                    // If the declaration is an internal variable and the setting is true for ignoring those, we return early.
                    return;
                }

                const key = isFunction ? declaration.id.name.toLowerCase() : '$' + declaration.id.name.toLowerCase();

                if (!declarationMap.has(key)) {
                    declarationMap.set(key, declaration);
                }
            });

            includes.push(
                ...script.getIncludes()
                    .map((include) => include.uri)
                    .filter((uri) => uri !== null)
                    .filter((uri) => !includes.includes(uri)),
            );
        }

        return [
            ...Array.from(declarationMap.values())
                // eslint-disable-next-line @stylistic/max-len
                .map((declaration) => this.declarationToCompletionItem(declaration)),
            ...this.getNativeSuggestions(),
        ];
    }

    public declarationToCompletionItem(
        declaration: WhereAstTypeEquals<Node, 'FunctionDeclaration' | 'VariableDeclarator' | 'Parameter'>,
    ) {
        const type = declaration.type;

        switch (type) {
            case 'FunctionDeclaration':
                return {
                    label: declaration.id.name,
                    kind: CompletionItemKind.Function,
                };
            case 'VariableDeclarator':
                return {
                    label: '$' + declaration.id.name,
                    kind: CompletionItemKind.Variable,
                };
            case 'Parameter':
                return {
                    label: '$' + declaration.id.name,
                    kind: CompletionItemKind.Variable,
                };
            default:
                throw new Error(`Unknown declaration type: ${type satisfies never}`);
        }
    }

    // FIXME: this should be moved to script or AST related class/file
    public getDeclarationsInFunction(
        declaration: AutoIt3.FunctionDeclaration,
        line: number | null = null,
    ) {
        const script = this.workpspace.get(declaration.location.source);

        if (script === undefined) {
            return [];
        }

        const declarations: WhereAstTypeEquals<Node, 'Parameter' | 'VariableDeclarator'>[] = [];

        script.filterNestedNode(declaration, (node) => {
            if (line !== null && node.location.start.line >= line) {
                return NodeFilterAction.SkipAndStopPropagation;
            }

            if (node.type === 'Parameter' || node.type === 'VariableDeclarator') {
                return NodeFilterAction.Continue;
            }

            return NodeFilterAction.Skip;
        }, declarations);

        return declarations;
    }

    public getNativeSuggestions() {
        return this.nativeSuggestions ??= Object.entries(nativeSuggestions)
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
    }
}
