import parser, { type AutoIt3, type GrammarSource, type LocationRange } from 'autoit3-pegjs';
import { Position, Range } from 'vscode-languageserver';
import AstWalker from './AstWalker';
import { isRangeWithinLocationRange } from './PositionHelper';
import { Node, NodeFilterAction } from './Script';

export type TextChange = string | { range: Range, text: string };

type ChildSlot = {
    parent: Record<string, unknown>,
    key: string,

    /** Index within the holding array, or -1 when held as a plain property. */
    index: number,
};

/**
 * Wraps the document text and its parsed AST.
 *
 * Full-text changes (a plain string) replace the entire document and re-parse it.
 * Incremental changes (a range + text) re-parse only the smallest branch of the
 * AST that contains the change, rebase the fragment positions to document
 * coordinates, and leave all other branches untouched, avoiding a full re-parse
 * of large documents.
 */
export default class AstWrapper {
    protected textContent: string;
    protected ast: AutoIt3.Program | undefined;
    protected grammarSource: GrammarSource | undefined;
    protected syntaxError: (SyntaxError & { location: LocationRange }) | undefined;

    public constructor(textContent: string, grammarSource?: GrammarSource) {
        this.textContent = textContent;
        this.grammarSource = grammarSource;
        this.applyFull(textContent);
    }

    protected static isSyntaxError(e: unknown): e is SyntaxError & { location: LocationRange } {
        return e instanceof Error && 'location' in e;
    }

    public update(change: TextChange): void {
        if (typeof change === 'string') {
            this.applyFull(change);

            return;
        }

        const startOffset = this.positionToOffset(change.range.start);
        const endOffset = this.positionToOffset(change.range.end);
        const textContent = this.textContent.slice(0, startOffset) + change.text + this.textContent.slice(endOffset);

        /**
         * Collects the chain of nodes containing the change, from the outermost
         * statement down to the smallest containing branch.
         */
        if (this.ast !== undefined) {
            const matches: Node[] = [];
            AstWalker.filterNestedNodes(this.ast.body, (node) => (
                isRangeWithinLocationRange(change.range, node.location)
                    ? NodeFilterAction.Continue
                    : NodeFilterAction.SkipAndStopPropagation
            ), matches);

            /*
             * Attempt to apply the change incrementally, starting at the deepest
             * (smallest) branch containing the change and moving outwards. A branch is
             * usable when its text, with the change applied, parses into exactly one
             * node of the same type as the branch itself, so it can be swapped 1:1.
             */
            for (let i = matches.length - 1; i >= 0; i--) {
                const branch = matches[i];

                if (branch === undefined) {
                    continue;
                }

                const parent: object = matches[i - 1] ?? this.ast;

                if (this.updateBranch(branch, parent, startOffset, endOffset, change.text, textContent)) {
                    return;
                }
            }
        }

        /*
         * The change could not be applied incrementally, or there is no AST to
         * apply it to (previous syntax error), re-parse everything.
         */
        this.applyFull(textContent);
    }

    /** Returns the syntax error of the most recent failed parse, if any. */
    public getSyntaxError(): (SyntaxError & { location: LocationRange }) | undefined {
        return this.syntaxError;
    }

    public hasProgram(): boolean {
        return this.ast !== undefined;
    }

    public getText(location?: LocationRange): string {
        if (location === undefined) {
            return this.textContent;
        }

        return this.textContent.slice(location.start.offset, location.end.offset);
    }

    /** @throws When the document currently has syntax errors. */
    public getProgram(): AutoIt3.Program {
        if (this.ast === undefined) {
            throw new Error('No AST available, the document currently has syntax errors.');
        }

        return this.ast;
    }

    /**
     * Replaces the entire document text, keeping the new text and reporting via
     * {@link getSyntaxError} when it cannot be parsed.
     */
    protected applyFull(text: string): void {
        this.textContent = text;

        try {
            this.ast = this.parse(text);
            this.syntaxError = undefined;
        } catch (e) {
            if (!AstWrapper.isSyntaxError(e)) {
                throw e;
            }

            // Drop the stale AST rather than keeping positions mismatched with the text.
            this.ast = undefined;
            this.syntaxError = e;
        }
    }

    /**
     * Re-parses a single branch with the change applied and splices the result
     * back into the tree, rebasing the new node's locations to document
     * coordinates. Returns false when the branch is not incrementally updateable.
     */
    protected updateBranch(
        branch: Node,
        parent: object,
        startOffset: number,
        endOffset: number,
        text: string,
        textContent: string,
    ): boolean {
        const branchStart = branch.location.start.offset;
        const branchEnd = branch.location.end.offset;
        const branchText = this.textContent.slice(branchStart, startOffset) + text + this.textContent.slice(endOffset, branchEnd);

        let program: AutoIt3.Program;

        try {
            program = this.parse(branchText);
        } catch {
            // The fragment is no longer valid in isolation.
            return false;
        }

        if (program.body.length !== 1 || program.body[0]?.type !== branch.type) {
            return false;
        }

        const slot = this.findChildSlot(parent, branch);

        if (slot === null) {
            return false;
        }

        const replacement = program.body[0];
        this.rebaseLocations(program, branch.location.start);

        if (slot.index === -1) {
            slot.parent[slot.key] = replacement;
        } else {
            (slot.parent[slot.key] as unknown[])[slot.index] = replacement;
        }

        this.textContent = textContent;

        return true;
    }

    /**
     * Shifts the locations of every node in the given (fragment) program so they
     * resolve against document coordinates, given the location of the fragment's
     * first character in the document.
     */
    protected rebaseLocations(program: AutoIt3.Program, origin: { line: number, column: number, offset: number }): void {
        const lineDelta = origin.line - 1;
        const columnDelta = origin.column - 1;
        const offsetDelta = origin.offset;

        AstWalker.filterNestedNodes(program.body, (node) => {
            const location = node.location;

            // Only columns on the fragment's first line need shifting.
            (node as { location: LocationRange }).location = {
                source: location.source,
                start: this.rebaseLocationPoint(location.start, lineDelta, columnDelta, offsetDelta),
                end: this.rebaseLocationPoint(location.end, lineDelta, columnDelta, offsetDelta),
            };

            return NodeFilterAction.Skip;
        }, []);
    }

    protected rebaseLocationPoint(
        point: { line: number, column: number, offset: number },
        lineDelta: number,
        columnDelta: number,
        offsetDelta: number,
    ): { line: number, column: number, offset: number } {
        return {
            line: point.line + lineDelta,
            offset: point.offset + offsetDelta,

            /*
             * Columns on fragment lines after the first are already identical to
             * their document columns.
             */
            column: point.column + (point.line === 1 ? columnDelta : 0),
        };
    }

    /** Locates the property or array entry of {@link parent} holding {@link node}. */
    protected findChildSlot(parent: object, node: object): ChildSlot | null {
        const record = parent as Record<string, unknown>;

        for (const key of Object.keys(record)) {
            const value = record[key];

            if (Array.isArray(value)) {
                const index = value.indexOf(node);

                if (index !== -1) {
                    return { parent: record, key, index };
                }
            } else if (value === node) {
                return { parent: record, key, index: -1 };
            }
        }

        return null;
    }

    protected positionToOffset(position: Position): number {
        const lines = this.textContent.split('\n');
        let offset = 0;

        for (let line = 0; line < position.line; line++) {
            const lineText = lines[line];

            if (lineText === undefined) {
                break;
            }

            offset += lineText.length + 1;
        }

        return offset + position.character;
    }

    protected parse(text: string): AutoIt3.Program {
        return parser.parse(text, { grammarSource: this.grammarSource });
    }
}
