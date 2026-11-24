import { Connection, Disposable, DocumentSymbol, DocumentSymbolParams, SymbolInformation, SymbolKind } from 'vscode-languageserver';
import BaseProvider from './BaseProvider';
import { isLocationRangeWithinLocationRange, locationRangeToRange } from '../autoit/PositionHelper';

export class DocumentSymbolProvider extends BaseProvider {
    public override register(connection: Connection): Disposable {
        return connection.onDocumentSymbol(this.getDocumentSymbol.bind(this));
    }

    public getDocumentSymbol(params: DocumentSymbolParams): SymbolInformation[] | DocumentSymbol[] | null | undefined {
        const script = this.workspace.get(params.textDocument.uri);

        if (script === undefined) {
            return null;
        }

        const scope = script.getScope();
        const symbols: DocumentSymbol[] = [];

        for (const symbol of scope.getSymbols().values()) {
            const subscopes = Array.from(scope.getSubscopes());

            for (const declaration of symbol.getDeclarations()) {
                const displayName = symbol.getDisplayName();
                const name = declaration.type === 'VariableIdentifier'
                    ? displayName.slice(1)
                    : displayName;

                symbols.push({
                    kind: declaration.type === 'Identifier'
                        ? SymbolKind.Function
                        : SymbolKind.Variable,
                    name: name,
                    range: locationRangeToRange(
                        declaration.location,
                    ),
                    selectionRange: locationRangeToRange(
                        declaration.location,
                    ),
                    children: declaration.type === 'Identifier'
                        ? Array.from(
                            subscopes
                                .find((subscope) => subscope.range !== undefined && isLocationRangeWithinLocationRange(declaration.location, subscope.range))
                                ?.getSymbols()
                                .values() ?? [],
                        ).reduce<DocumentSymbol[]>((previous, childSymbol) => {
                            for (const childDeclaration of childSymbol.getDeclarations()) {
                                const displayName = childSymbol.getDisplayName();
                                const name = childDeclaration.type === 'VariableIdentifier'
                                    ? displayName.slice(1)
                                    : displayName;

                                previous.push({
                                    kind: childDeclaration.type === 'Identifier'
                                        ? SymbolKind.Function
                                        : SymbolKind.Variable,
                                    name: name,
                                    range: locationRangeToRange(
                                        childDeclaration.location,
                                    ),
                                    selectionRange: locationRangeToRange(
                                        childDeclaration.location,
                                    ),
                                });
                            }

                            return previous;
                        }, [])
                        : [],
                });
            }
        }

        return symbols;
    }
}
