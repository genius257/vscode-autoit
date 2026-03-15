import { LocationRange } from 'autoit3-pegjs';
import { URI } from 'vscode-uri';

export type ScopeKind = 'local' | 'global';

export default class Scope {
    public readonly id: string;
    public readonly kind: ScopeKind;
    public readonly uri?: URI;
    public readonly range?: LocationRange;
    public readonly name?: string; // e.g., function name for 'local' scope
    public readonly parent?: Scope;

    public constructor(
        kind: ScopeKind,
        range?: LocationRange,
        uri?: URI,
        name?: string,
        parent?: Scope,
    ) {
        this.kind = kind;
        this.uri = uri;
        this.range = range;
        this.name = name;
        this.parent = parent;
        this.id = `${kind}:${uri.toString()}:${range.start.line}:${range.start.column}`;
    }

    public isDescendantOf(ancestor: Scope): boolean {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let scope: Scope | undefined = this;

        while (scope !== undefined) {
            if (scope.id === ancestor.id) {
                return true;
            }

            scope = scope.parent;
        }

        return false;
    }
}
