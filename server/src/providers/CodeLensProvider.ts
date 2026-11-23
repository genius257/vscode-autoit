import { CodeLens, CodeLensParams, Connection, Disposable, Location } from 'vscode-languageserver';
import BaseProvider from './BaseProvider';
import { locationRangeToRange } from '../autoit/PositionHelper';
import Symbol, { type Node as SymbolNode } from '../autoit/Symbol';

export class CodeLensProvider extends BaseProvider {
    public override register(connection: Connection): Disposable {
        const disposables: Disposable[] = [
            connection.onCodeLens(this.getCodeLens.bind(this)),
            connection.onCodeLensResolve(this.getCodeLensResolve.bind(this)),
        ];

        return Disposable.create(() => {
            disposables.forEach((disposable) => {
                disposable.dispose();
            });
        });
    }

    public getCodeLens(params: CodeLensParams): CodeLens[] | null | undefined {
        const script = this.workspace.get(params.textDocument.uri);

        if (script === undefined) {
            return null;
        }

        const codeLenses: CodeLens[] = [];

        script.getScope().getSymbols()
            .forEach(
                (symbol) => {
                    const declarations = symbol.getDeclarations();
                    declarations.forEach((declaration) => codeLenses.push({
                        range: locationRangeToRange(declaration.location),
                        data: declaration,
                    }));
                },
            );

        return codeLenses;
    }

    public getCodeLensResolve(codeLens: CodeLens): CodeLens {
        const symbolNode = codeLens.data as SymbolNode | undefined;

        switch (symbolNode?.type) {
            case 'Identifier':
            case 'SyntheticIdentifier':
            case 'VariableIdentifier':
            case 'SyntheticVariableIdentifier':
            {
                const symbolKey = Symbol.getNodeName(symbolNode);

                const references = this.workspace.resolveSymbolForNode(symbolNode, symbolKey)?.getReferences();

                const count = references?.size ?? 0;

                const locations: Location[] = Array.from(references?.values() ?? []).map((referance) => ({
                    uri: referance.location.source.toString(),
                    range: locationRangeToRange(referance.location),
                }));

                codeLens.command = {
                    title: `${count} ${count === 1 ? 'reference' : 'references'}`,
                    command: 'editor.action.showReferences',
                    arguments: [
                        symbolNode.location.source,
                        codeLens.range.start,
                        locations,
                    ],
                };

                break;
            }
            default:
                break;
        }

        return codeLens;
    }
}
