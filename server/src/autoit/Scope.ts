import { LocationRange } from 'autoit3-pegjs';
import { URI } from 'vscode-uri';
import Symbol from './Symbol';

export default class Scope {
    public readonly id: string;
    public readonly uri?: URI;
    public readonly range?: LocationRange;
    public readonly parent: Scope | null;

    protected symbols: Map<string, Symbol>;
    protected subscopes: Set<Scope>;

    public constructor(
        range?: LocationRange,
        uri?: URI,
        symbols: typeof this.symbols = new Map(),
        subscopes: typeof this.subscopes = new Set(),
        parent: Scope | null = null,
    ) {
        this.uri = uri;
        this.range = range;
        this.symbols = symbols;
        this.subscopes = subscopes;
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
}
