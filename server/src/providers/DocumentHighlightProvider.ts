import { Connection, Disposable, DocumentHighlight, DocumentHighlightParams } from 'vscode-languageserver';
import BaseProvider from './BaseProvider';
import Symbol, { type Node as SymbolNode } from '../autoit/Symbol';
import { locationRangeToRange } from '../autoit/PositionHelper';

export class DocumentHighlightProvider extends BaseProvider {
    public override register(connection: Connection): Disposable {
        return connection.onDocumentHighlight(this.getDocumentHighlight.bind(this));
    }

    public getDocumentHighlight(params: DocumentHighlightParams): DocumentHighlight[] | null | undefined {
        const script = this.workspace.get(params.textDocument.uri);

        if (script === undefined) {
            return null;
        }

        const nodesAt = script.getNodesAt(params.position);
        const identifierAtPos = nodesAt.reverse().find((node): node is SymbolNode => node.type === 'Identifier' || node.type === 'VariableIdentifier' || node.type === 'Macro' || node.type === 'SyntheticIdentifier' || node.type === 'SyntheticVariableIdentifier');

        if (identifierAtPos === undefined) {
            return null;
        }

        const scope = identifierAtPos.type === 'Identifier' || identifierAtPos.type === 'SyntheticIdentifier'
            ? script.getScope()
            : script.getScopeAtPosition(params.position);

        const symbolKey = Symbol.getNodeName(identifierAtPos);

        const symbol = scope.getSymbol(symbolKey);

        if (symbol === undefined) {
            return null;
        }

        return [
            ...symbol.getDeclarations(),
            ...symbol.getReferences(),
            ...symbol.getAssignments(),
        ].map<DocumentHighlight>((node) => ({
            range: locationRangeToRange(node.location),
        }));
    }
}
