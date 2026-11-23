import { Connection, Disposable, Location, ReferenceParams } from 'vscode-languageserver';
import BaseProvider from './BaseProvider';
import Symbol, { type Node as SymbolNode } from '../autoit/Symbol';
import { locationRangeToRange } from '../autoit/PositionHelper';

export class ReferencesProvider extends BaseProvider {
    public override register(connection: Connection): Disposable {
        return connection.onReferences(this.getReferences.bind(this));
    }

    public getReferences(params: ReferenceParams): Location[] | null | undefined {
        const script = this.workspace.get(params.textDocument.uri);

        if (script === undefined) {
            return null;
        }

        const nodesAt = script.getNodesAt(params.position);
        const identifierAtPos = nodesAt.reverse().find((node): node is SymbolNode => node.type === 'Identifier' || node.type === 'VariableIdentifier' || node.type === 'Macro' || node.type === 'SyntheticIdentifier' || node.type === 'SyntheticVariableIdentifier');

        if (identifierAtPos === undefined) {
            return null;
        }

        const symbolKey = Symbol.getNodeName(identifierAtPos);

        const symbol = this.workspace.resolveSymbolForNode(identifierAtPos, symbolKey);

        if (symbol === undefined) {
            return null;
        }

        const results: Location[] = [];

        if (params.context.includeDeclaration) {
            results.push(...[...symbol.getDeclarations()].map((declaration): Location => ({
                uri: declaration.location.source.toString(),
                range: locationRangeToRange(declaration.location),
            })));
        }

        results.push(...[...symbol.getReferences()].map((reference): Location => ({
            uri: reference.location.source.toString(),
            range: locationRangeToRange(reference.location),
        })));

        return results;
    }
}
