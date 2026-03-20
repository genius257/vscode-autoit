import { LocationRange } from 'autoit3-pegjs';
import { URI } from 'vscode-uri';

export default class Scope {
    public readonly id: string;
    public readonly uri?: URI;
    public readonly range?: LocationRange;
    public readonly parent: Scope | null;

    protected declarations: Map<string, Node>;
    protected assignments: Map<string, Node>;
    protected references: Map<string, Node>;

    public constructor(
        range?: LocationRange,
        uri?: URI,
        declarations: typeof this.declarations = new Map(),
        assignments: typeof this.assignments = new Map(),
        references: typeof this.references = new Map(),
        parent: Scope | null = null,
    ) {
        this.uri = uri;
        this.range = range;
        this.declarations = declarations;
        this.assignments = assignments;
        this.references = references;
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
