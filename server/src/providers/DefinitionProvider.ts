import { Connection, Definition, DefinitionParams, Disposable, LocationLink } from 'vscode-languageserver';
import BaseProvider from './BaseProvider';
import Symbol, { type Node as SymbolNode } from '../autoit/Symbol';
import { locationRangeToRange } from '../autoit/PositionHelper';

export class DefinitionProvider extends BaseProvider {
    public override register(connection: Connection): Disposable {
        return connection.onDefinition(this.getDefinition.bind(this));
    }

    public getDefinition(params: DefinitionParams): Definition | LocationLink[] | null | undefined {
        const script = this.workspace.get(params.textDocument.uri);

        if (script === undefined) {
            return [];
        }

        const nodesAt = script.getNodesAt(params.position);
        const identifierAtPos = nodesAt.reverse().find((node): node is SymbolNode => node.type === 'Identifier' || node.type === 'VariableIdentifier' || node.type === 'Macro' || node.type === 'SyntheticIdentifier' || node.type === 'SyntheticVariableIdentifier');

        if (identifierAtPos === undefined) {
            return [];
        }

        const symbolKey = Symbol.getNodeName(identifierAtPos);

        const symbol = this.workspace.resolveSymbolForNode(identifierAtPos, symbolKey);

        if (symbol === undefined) {
            return [];
        }

        const configuration = this.workspace.getConfiguration();

        if (configuration?.showAllDeclarations === false) {
            // Closest match mode: walk the scope chain for the nearest declaration
            const closestDeclaration = this.workspace.getDeclarationsAtPosition(
                params.textDocument.uri,
                symbolKey,
                params.position,
            )[0];

            /*
             * Fall back to the first merged declaration if the closest match is empty
             * (e.g. symbol only declared in an include)
             */
            const declaration = closestDeclaration ?? [...symbol.getDeclarations()][0];

            if (declaration === undefined) {
                return [];
            }

            return [declaration].map((declaration) => ({
                targetUri: declaration.location.source.toString(),
                targetRange: locationRangeToRange(
                    declaration.location,
                ),
                targetSelectionRange: locationRangeToRange(
                    declaration.location,
                ),
            }));
        }

        // All declarations mode (default)
        return [...symbol.getDeclarations()].map((declaration) => ({
            targetUri: declaration.location.source.toString(),
            targetRange: locationRangeToRange(
                declaration.location,
            ),
            targetSelectionRange: locationRangeToRange(
                declaration.location,
            ),
        }));
    }
}
