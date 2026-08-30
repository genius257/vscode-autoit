import parser, { type AutoIt3, type GrammarSource, type LocationRange } from 'autoit3-pegjs';
import { Position, Range } from 'vscode-languageserver';
import AstWalker from './AstWalker';
import { offsetToLocation } from './PositionHelper';
import { NodeFilterAction } from './Script';

export type TextChange = string | { range: Range, text: string };

/**
 * Wraps the document text and its parsed AST.
 *
 * Full-text changes (a plain string) replace the entire document and re-parse it.
 * Incremental changes (a range + text) resolve the smallest region of sibling
 * statements affected by the change, re-parse only that region's text, splice the
 * resulting nodes back into the tree, and shift the positions of following
 * siblings — avoiding a full re-parse of large documents.
 */
export default class AstWrapper {
    protected textContent: string;
    protected ast: AutoIt3.Program | undefined;
    protected grammarSource: GrammarSource | undefined;
    protected syntaxError: (SyntaxError & { location: LocationRange }) | undefined;

    /**
     * Region parses lose their advantage once the affected slice grows beyond
     * this fraction of the document; such changes re-parse everything instead.
     */
    protected regionSizeLimitRatio = 0.35;

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

        const ast = this.ast;

        if (ast === undefined) {
            this.applyFull(textContent);

            return;
        }

        const offsetDelta = change.text.length - (endOffset - startOffset);
        const lineIndex = this.buildLineIndex(textContent);

        /*
         * Resolve the sibling window: every top-level statement intersecting the
         * changed range. Zero-width insertions on a seam between two statements
         * intersect both, which keeps the inserted text attached to real content.
         */
        let firstIndex = -1;
        let lastIndex = -1;

        for (let index = 0; index < ast.body.length; index++) {
            const node = ast.body[index];

            if (node === undefined) {
                continue;
            }

            const { offset: nodeStart } = node.location.start;
            const { offset: nodeEnd } = node.location.end;

            if (nodeStart <= endOffset && nodeEnd >= startOffset) {
                if (firstIndex === -1) {
                    firstIndex = index;
                }

                lastIndex = index;
            }
        }

        if (firstIndex === -1) {
            /*
             * Edit outside any statement (whitespace in an inter-statement gap,
             * or leading/trailing whitespace). Anchor to the nearest preceding
             * sibling — the gap's whitespace is part of its trailing location —
             * so later statements are never reparsed for such edits.
             */
            if (ast.body.length === 0) {
                this.applyFull(textContent);

                return;
            }

            firstIndex = lastIndex = 0;

            for (let index = ast.body.length - 1; index >= 0; index--) {
                const node = ast.body[index];

                if (node !== undefined && node.location.end.offset <= startOffset) {
                    firstIndex = lastIndex = index;

                    break;
                }
            }
        }

        const firstNode = ast.body[firstIndex];
        const lastNode = ast.body[lastIndex];

        if (firstNode === undefined || lastNode === undefined) {
            this.applyFull(textContent);

            return;
        }

        /*
         * Build the fragment from the window's outer edges with the change applied,
         * mapped to new-text coordinates.
         */
        const fragmentStartOld = Math.min(startOffset, firstNode.location.start.offset);
        const fragmentEndOld = Math.max(endOffset, lastNode.location.end.offset);
        const mapOffset = (offset: number): number => (offset <= startOffset ? offset : offset + offsetDelta);

        /*
         * Extend the fragment up to the start of the next surviving sibling (or
         * EOF): the parser consumes inter-statement whitespace greedily into the
         * preceding statement's location, so the fragment must include it for the
         * spliced locations to match a fresh parse.
         */
        const nextSiblingStart = ast.body[lastIndex + 1]?.location.start.offset ?? textContent.length;
        const fragmentStart = mapOffset(fragmentStartOld);
        const fragmentEnd = Math.max(mapOffset(fragmentEndOld), mapOffset(nextSiblingStart), fragmentStart);
        const fragment = textContent.slice(fragmentStart, fragmentEnd);

        if (fragment.length > textContent.length * this.regionSizeLimitRatio) {
            this.applyFull(textContent);

            return;
        }

        let fragmentProgram: AutoIt3.Program;

        try {
            fragmentProgram = this.parse(fragment);
        } catch (e) {
            if (!AstWrapper.isSyntaxError(e)) {
                throw e;
            }

            /*
             * The document is currently syntactically invalid. Drop the AST and
             * record the error; the next update re-parses the full text, which is
             * the only reliable way forward from an invalid intermediate state.
             * The error location arrives in fragment coordinates and is rebased
             * to document coordinates to match applyFull's contract.
             */
            this.textContent = textContent;
            this.ast = undefined;
            this.syntaxError = this.rebaseSyntaxErrorLocation(e, offsetToLocation(fragmentStart, textContent));

            return;
        }

        // Rebase the new nodes to document coordinates...
        this.rebaseLocations(fragmentProgram, offsetToLocation(fragmentStart, textContent));

        // ...splice them in place of the old window members...
        const replacementNodes = [...fragmentProgram.body];
        (ast.body as unknown[]).splice(firstIndex, lastIndex - firstIndex + 1, ...replacementNodes);

        // ...and shift every node in the following siblings' subtrees to its post-edit position.
        for (let index = firstIndex + replacementNodes.length; index < ast.body.length; index++) {
            const sibling = ast.body[index];

            if (sibling === undefined) {
                continue;
            }

            AstWalker.filterNestedNodes([sibling], (node) => {
                const { location } = node;

                (node as { location: LocationRange }).location = {
                    source: location.source,
                    start: this.locationPointAt(location.start.offset + offsetDelta, lineIndex),
                    end: this.locationPointAt(location.end.offset + offsetDelta, lineIndex),
                };

                return NodeFilterAction.Skip;
            }, []);
        }

        (ast as { location: LocationRange }).location = {
            source: ast.location.source,
            start: this.locationPointAt(0, lineIndex),
            end: this.locationPointAt(textContent.length, lineIndex),
        };

        this.textContent = textContent;
        this.syntaxError = undefined;
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
     * Rebases a syntax error caught during fragment parsing from fragment
     * coordinates to document coordinates, matching applyFull's contract.
     */
    protected rebaseSyntaxErrorLocation(
        e: SyntaxError & { location: LocationRange },
        origin: { line: number, column: number, offset: number },
    ): SyntaxError & { location: LocationRange } {
        const lineDelta = origin.line - 1;
        const columnDelta = origin.column - 1;
        const offsetDelta = origin.offset;

        // The caught error instance is owned by the wrapper, so its location is rebased in place.
        (e as { location: LocationRange }).location = {
            source: e.location.source,
            start: this.rebaseLocationPoint(e.location.start, lineDelta, columnDelta, offsetDelta),
            end: this.rebaseLocationPoint(e.location.end, lineDelta, columnDelta, offsetDelta),
        };

        return e;
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
            /*
             * Key order mirrors freshly parsed locations so structural
             * comparisons against a full re-parse are stable.
             */
            offset: point.offset + offsetDelta,
            line: point.line + lineDelta,

            /*
             * Columns on fragment lines after the first are already identical to
             * their document columns.
             */
            column: point.column + (point.line === 1 ? columnDelta : 0),
        };
    }

    /** Offsets at which each line of {@link text} starts. */
    protected buildLineIndex(text: string): number[] {
        const lineIndex = [0];

        for (let offset = 0; offset < text.length; offset++) {
            if (text[offset] === '\n') {
                lineIndex.push(offset + 1);
            }
        }

        return lineIndex;
    }

    /** Converts an offset in the new text to a zero-based line/character position. */
    protected positionAtOffset(lineIndex: number[], offset: number): Position {
        let low = 0;
        let high = lineIndex.length - 1;

        while (low < high) {
            const mid = Math.ceil((low + high) / 2);
            const midStart = lineIndex[mid];

            if (midStart === undefined || midStart > offset) {
                high = mid - 1;
            } else {
                low = mid;
            }
        }

        const lineStart = lineIndex[low] ?? 0;

        return { line: low, character: offset - lineStart };
    }

    /** Builds a location point at an offset in the new text. */
    protected locationPointAt(offset: number, lineIndex: number[]): { line: number, column: number, offset: number } {
        const position = this.positionAtOffset(lineIndex, offset);

        // Key order mirrors freshly parsed locations (see rebaseLocationPoint).
        return { offset, line: position.line + 1, column: position.character + 1 };
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
