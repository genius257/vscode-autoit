import { LocationRange } from 'autoit3-pegjs';
import { URI } from 'vscode-uri';
import Symbol, { Node } from './Symbol';
import { OpaqueType } from '@utils/OpaqueType';

export type SymbolKey = OpaqueType<string, "SymbolKey">;

export default class Scope {
    public readonly id: string;
    public readonly uri?: URI;
    public readonly range?: LocationRange;
    public readonly parent: Scope | null;

    protected symbols = new Map<string, Symbol>();
    protected subscopes = new Set<Scope>();

    public constructor(
        range?: LocationRange,
        uri?: URI,
        parent: Scope | null = null,
    ) {
        this.uri = uri;
        this.range = range;
        this.parent = parent;
        this.id = `${uri}:${range?.start.line}:${range?.start.column}`;
    }

    public isDescendantOf(ancestor: Scope): boolean {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let scope: Scope | null = this;

        while (scope !== null) {
            if (scope === ancestor) {
            // if (scope.id === ancestor.id) {
                return true;
            }

            scope = scope.parent;
        }

        return false;
    }

    public addSymbol(symbol: Symbol) {
        if (this.symbols.has(symbol.name)) {
            throw new Error('duplicate symbols in scope, not allowed');
        }

        this.symbols.set(symbol.name, symbol);
    }

    public removeSymbol(symbol: Symbol) {
        return this.symbols.delete(symbol.name);
    }

    public getSymbol(symbolKey: SymbolKey) {
        return this.symbols.get(symbolKey);
    }

    public getSymbols(): ReadonlyMap<string, Symbol> {
        return this.symbols;
    }

    public addSubscope(scope: Scope) {
        this.subscopes.add(scope);
    }

    public removeSubscope(scope: Scope) {
        this.subscopes.delete(scope);
    }

    public getSubscopes(): Readonly<typeof this.subscopes> {
        return this.subscopes;
    }

    public addDeclaration(node: Node) {
        this.getOrCreateSymbol(node).addDeclaration(node);
    }

    public addAssignment(node: Node) {
        this.getOrCreateSymbol(node).addAssignment(node);
    }

    public addReference(node: Node) {
        this.getOrCreateSymbol(node).addReference(node);
    }

    public isGlobal(): boolean {
        return this.parent === null;
    }

    protected getOrCreateSymbol(node: Node): Symbol {
        const nodeName = Symbol.getNodeName(node);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.symbols.get(nodeName) ?? this.symbols.set(nodeName, new Symbol(node)).get(nodeName)!;
    }
}
