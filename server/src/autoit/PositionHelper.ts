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
    const match = text.match(new RegExp(`^(?:[^\\n]*\\n){${position.line}}`));

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
        line: (textBeforeOffset.match(/\n/g) || []).length + 1, // https://stackoverflow.com/a/4009768/3958400
        offset: offset,
    };
}

export function isPositonWithinLocationRange(
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
