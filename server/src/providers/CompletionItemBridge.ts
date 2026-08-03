import { CompletionItem, CompletionItemKind, CompletionList, MarkupContent, MarkupKind, Position } from 'vscode-languageserver';
import { type AutoIt3 } from 'autoit3-pegjs';
import { Workspace } from '../autoit/Workspace';
import Symbol from '../autoit/Symbol';
import * as PositionHelper from '../autoit/PositionHelper';
import * as Parser from '../autoit/Parser';
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
            label: symbol.getDisplayName(),
            kind: this.resolveCompletionItemKind(symbol),
            documentation: this.resolveCompletionItemDocumentation(symbol),
        }))
            .concat(this.getNativeSuggestions());
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
