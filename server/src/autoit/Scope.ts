import { LocationRange } from 'autoit3-pegjs';
import { URI } from 'vscode-uri';

export default class Scope {
    public readonly id: string;
    public readonly uri?: URI;
    public readonly range?: LocationRange;
    public readonly parent: Scope | null;

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
}
