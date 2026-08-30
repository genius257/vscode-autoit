import { type LocationRange, type Location, type GrammarSource } from 'autoit3-pegjs';
import { Range, Position } from 'vscode-languageserver';

/** Converts a autoit3-pegjs LocationRange to a vscode Range */
export function locationRangeToRange(locationRange: LocationRange): Range {
    return {
        start: locationToPosition(locationRange.start),
        end: locationToPosition(locationRange.end),
    };
}

export function rangeToLocationRange(
    range: Range,
    text?: string,
    source?: GrammarSource,
): LocationRange {
    return {
        start: positionToLocation(range.start, text),
        end: positionToLocation(range.end, text),
        source: source ?? '',
    };
}

export function locationToPosition(location: Location): Position {
    return {
        character: location.column - 1,
        line: location.line - 1,
    };
}

export function positionToLocation(
    position: Position,
    text?: string,
): Location {
    return {
        column: position.character + 1,
        line: position.line + 1,
        offset: text === undefined
            ? 0
            : positionToOffset(position, text),
    };
}

export function positionToOffset(position: Position, text: string): number {
    const match = new RegExp(`^(?:[^\\n]*\\n){${position.line}}`).exec(text);

    if (match === null) {
        throw new Error(`Failed to find line #${position.line + 1} in source, when converting document position to text offset.`);
    }

    return match[0].length + position.character;
}

export function offsetToPosition(offset: number, text: string): Position {
    return locationToPosition(offsetToLocation(offset, text));
}

export function offsetToLocation(offset: number, text: string): Location {
    const textBeforeOffset = text.substring(0, offset);
    const lastNewLineOffset = textBeforeOffset.lastIndexOf('\n');

    return {
        column: textBeforeOffset.substring(
            lastNewLineOffset === -1 ? 0 : lastNewLineOffset + 1,
        ).length + 1,
        line: (textBeforeOffset.match(/\n/g) ?? []).length + 1, // https://stackoverflow.com/a/4009768/3958400
        offset: offset,
    };
}

/**
 * Recursively remaps all LocationRange objects within a parsed AST (or any
 * nested structure) onto the coordinates of an enclosing document.
 *
 * Locations are rewritten by translating their offsets by `offsetDelta` and
 * recomputing line/column from the enclosing document's text.
 *
 * @param node Structure to remap in place (typically a parsed AST body).
 * @param offsetDelta Absolute offset in the document where the parsed input begins.
 * @param text The enclosing document's text.
 */
export function remapLocations(node: unknown, offsetDelta: number, text: string): void {
    if (node === null || typeof node !== 'object') {
        return;
    }

    for (const value of Object.values(node)) {
        if (value === null || typeof value !== 'object') {
            continue;
        }

        const { start, end } = value as { start?: unknown, end?: unknown };

        if (
            typeof start === 'object' && start !== null && typeof (start as { offset?: unknown }).offset === 'number' &&
            typeof end === 'object' && end !== null && typeof (end as { offset?: unknown }).offset === 'number'
        ) {
            (value as { start: Location, end: Location }).start = offsetToLocation(
                offsetDelta + (start as { offset: number }).offset,
                text,
            );
            (value as { start: Location, end: Location }).end = offsetToLocation(
                offsetDelta + (end as { offset: number }).offset,
                text,
            );

            continue;
        }

        remapLocations(value, offsetDelta, text);
    }
}

export function isPositionWithinLocationRange(
    position: Position,
    locationRange: LocationRange,
): boolean {
    const location = positionToLocation(position);

    // Check if position line is above the start line or below the end line
    if (
        location.line < locationRange.start.line ||
        location.line > locationRange.end.line
    ) {
        return false;
    }

    // Check if position is on the start line but before the start column
    if (
        location.line === locationRange.start.line &&
        location.column < locationRange.start.column
    ) {
        return false;
    }

    // Check if position is on the end line but after the end column
    if (
        location.line === locationRange.end.line &&
        location.column > locationRange.end.column
    ) {
        return false;
    }

    // If none of the above conditions are met, the position is within the range
    return true;
}

export function isLocationWithinLocationRange(location: Location, locationRange: LocationRange) {
    return isPositionWithinLocationRange(locationToPosition(location), locationRange);
}

/**
 * Returns true if the first location is at or before the second location.
 * Locations are compared by line and then by column (both 1-based in pegjs space).
 */
export function isLocationBeforeOrEqual(location: Location, other: Location): boolean {
    if (location.line < other.line) {
        return true;
    }

    return location.line === other.line && location.column <= other.column;
}

/**
 * Returns true if the inner LocationRange is entirely contained within the outer LocationRange.
 */
export function isLocationRangeWithinLocationRange(
    inner: LocationRange,
    outer: LocationRange,
): boolean {
    return (
        inner.source === outer.source &&
        inner.start.offset >= outer.start.offset &&
        inner.end.offset <= outer.end.offset
    );
}

export function isRangeWithinLocationRange(
    inner: Range,
    outer: LocationRange,
): boolean {
    const outerRange = locationRangeToRange(outer);

    return (
        isPositionBeforeOrEqual(outerRange.start, inner.start) &&
        isPositionBeforeOrEqual(inner.end, outerRange.end)
    );
}

export function isPositionBeforeOrEqual(position: Position, other: Position): boolean {
    if (position.line < other.line) {
        return true;
    }

    return position.line === other.line && position.character <= other.character;
}
