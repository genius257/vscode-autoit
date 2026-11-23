import { type AutoIt3 } from 'autoit3-pegjs';
import { Connection, Disposable, Hover, HoverParams, MarkupContent, MarkupKind } from 'vscode-languageserver';
import { locationRangeToRange, locationToPosition } from '../autoit/PositionHelper';
import Symbol, { type Node as SymbolNode } from '../autoit/Symbol';
import nativeSuggestions from '../autoit/internal';
import BaseProvider from './BaseProvider';
import { AstArrayToStringArray, AstToString } from '../autoit/Parser';
import { getScopeLabel } from '../autoit/DeclarationScope';
import buildSignatureLabel from '@utils/signatureParams';

export class HoverProvider extends BaseProvider {
    public override register(connection: Connection): Disposable {
        return connection.onHover(this.getHover.bind(this));
    }

    public getHover(params: HoverParams): Hover | null | undefined {
        const script = this.workspace.get(params.textDocument.uri);

        if (script === undefined) {
            return null;
        }

        const nodesAt = script.getNodesAt(params.position);
        nodesAt.reverse();

        if (nodesAt[0]?.type === 'ExitStatement') {
            return {
                contents: {
                    kind: MarkupKind.Markdown,
                    value: [
                        '```au3',
                        'Exit ( $return_code = 0 )',
                        '```',
                        'Terminates the script.',
                    ].join('\n'),
                },
                range: locationRangeToRange(nodesAt[0].location),
            };
        }

        const identifierAtPos = nodesAt.find((node): node is SymbolNode => node.type === 'Identifier' || node.type === 'VariableIdentifier' || node.type === 'Macro' || node.type === 'SyntheticIdentifier' || node.type === 'SyntheticVariableIdentifier');

        if (identifierAtPos === undefined) {
            return null;
        }

        // Check native suggestions first
        if (identifierAtPos.type === 'Identifier' || identifierAtPos.type === 'Macro' || identifierAtPos.type === 'SyntheticIdentifier') {
            const key = identifierAtPos.type === 'Macro'
                ? identifierAtPos.value.toLowerCase()
                : identifierAtPos.name.toLowerCase();
            const suggestion = nativeSuggestions[key];

            if (suggestion !== undefined) {
                return {
                    contents: { kind: MarkupKind.Markdown, value: `${suggestion.detail ?? ''}\n\n${suggestion.documentation}` } satisfies MarkupContent,
                    range: locationRangeToRange(
                        identifierAtPos.location,
                    ),
                };
            }
        }

        // Use the new Symbol system with position-aware scope traversal
        const symbolKey = Symbol.getNodeName(identifierAtPos);
        const symbol = this.workspace.resolveSymbolForNode(identifierAtPos, symbolKey);

        if (symbol === undefined) {
            return null;
        }

        const declarations = [...symbol.getDeclarations()];
        const docblocks = symbol.getDocblocks();

        if (declarations.length === 0 && docblocks.size === 0) {
            return null;
        }

        const contents: MarkupContent = {
            kind: MarkupKind.Markdown,
            value: '',
        };

        // Build hover text from declarations
        for (const declaration of declarations) {
            const docBlock = docblocks.get(declaration);

            if (contents.value === '') {
                const displayName = symbol.getDisplayName();
                let header = displayName;

                // Find the parent declarator node for richer hover info
                const declarationScript = this.workspace.get(declaration.location.source.toString());

                if (declarationScript !== undefined) {
                    const position = locationToPosition(declaration.location.start);
                    const declarationNodes = declarationScript.getNodesAt(position);
                    declarationNodes.reverse();

                    const declarator = declarationNodes.find((node): node is AutoIt3.VariableDeclaration | AutoIt3.FunctionDeclaration | AutoIt3.FormalParameter => node.type === 'VariableDeclarator' || node.type === 'FunctionDeclaration' || node.type === 'Parameter');

                    if (declarator !== undefined) {
                        switch (declarator.type) {
                            case 'VariableDeclarator':
                            {
                                let value: string | null = null;

                                if (declarator.init !== null) {
                                    value = AstToString(declarator.init);
                                }

                                const dimensions = 'dimensions' in declarator && declarator.dimensions.length > 0
                                    ? '[' + declarator.dimensions.map((dimension) => AstToString(dimension)).join('][') + ']'
                                    : '';

                                const scopeLabel = getScopeLabel(declarationScript, declaration);

                                header = `${scopeLabel === undefined ? '' : `(${scopeLabel}) `}${declaration.type === 'VariableIdentifier' ? '$' : ''}${declarator.id.name}${dimensions}${value === null ? '' : ' = ' + value}`;

                                break;
                            }
                            case 'FunctionDeclaration':
                            {
                                header = buildSignatureLabel(`Func ${declarator.id.name}`, AstArrayToStringArray(declarator.params)).label;

                                break;
                            }
                            case 'Parameter':
                            {
                                const parameterValue = declarator.init !== null ? AstToString(declarator.init) : null;
                                const scopeLabel = getScopeLabel(declarationScript, declaration);

                                header = `(parameter${scopeLabel === undefined ? '' : ', ' + scopeLabel}) $${declarator.id.name}${parameterValue === null ? '' : ' = ' + parameterValue}`;

                                break;
                            }
                            default:
                                break;
                        }
                    }
                }

                contents.value += `\`\`\`au3\n${header}\n\`\`\``;
            }

            if (docBlock !== undefined) {
                contents.value += `\n\n${docBlock.summary.toString()}\n\n${docBlock.description.toString()}\n\n${docBlock.tags.map((tag) => tag.render()).join('\n\n')}`;
            }
        }

        return {
            contents: contents,
            range: locationRangeToRange(
                identifierAtPos.location,
            ),
        };
    }
}
