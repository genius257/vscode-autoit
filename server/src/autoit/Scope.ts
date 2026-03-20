import { LocationRange } from 'autoit3-pegjs';
import { URI } from 'vscode-uri';

export default class Scope {
    public readonly id: string;
    public readonly uri?: URI;
    public readonly range?: LocationRange;
    public readonly name?: string; // e.g., function name for 'local' scope
    public readonly parent?: Scope;

    public constructor(
        range?: LocationRange,
        uri?: URI,
        name?: string,
        parent?: Scope,
    ) {
        this.uri = uri;
        this.range = range;
        this.name = name;
        this.parent = parent;
        this.id = `${uri}:${range?.start.line}:${range?.start.column}`;
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
