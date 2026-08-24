import { expect, test } from 'vitest';
import { Location, LocationRange } from 'autoit3-pegjs';
import { Position, Range } from 'vscode-languageserver';
import * as PositionHelper from './PositionHelper';

test('offsetToLocation', () => {
    const text = 'a\nb\nc\nd';

    let location = PositionHelper.offsetToLocation(1, text);
    expect(location).toMatchObject({
        line: 1,
        column: 2,
        offset: 1,
    } satisfies Location);

    location = PositionHelper.offsetToLocation(5, text);
    expect(location).toMatchObject({
        line: 3,
        column: 2,
        offset: 5,
    } satisfies Location);
});

test('isLocationBeforeOrEqual', () => {
    const a: Location = { line: 1, column: 1, offset: 0 };
    const b: Location = { line: 1, column: 2, offset: 1 };
    const c: Location = { line: 2, column: 1, offset: 2 };

    expect(PositionHelper.isLocationBeforeOrEqual(a, a)).toBe(true);
    expect(PositionHelper.isLocationBeforeOrEqual(a, b)).toBe(true);
    expect(PositionHelper.isLocationBeforeOrEqual(b, a)).toBe(false);
    expect(PositionHelper.isLocationBeforeOrEqual(a, c)).toBe(true);
    expect(PositionHelper.isLocationBeforeOrEqual(c, a)).toBe(false);
});

test('isPositionBeforeOrEqual', () => {
    const a: Position = { line: 0, character: 0 };
    const b: Position = { line: 0, character: 1 };
    const c: Position = { line: 1, character: 0 };

    expect(PositionHelper.isPositionBeforeOrEqual(a, a)).toBe(true);
    expect(PositionHelper.isPositionBeforeOrEqual(a, b)).toBe(true);
    expect(PositionHelper.isPositionBeforeOrEqual(b, a)).toBe(false);
    expect(PositionHelper.isPositionBeforeOrEqual(a, c)).toBe(true);
    expect(PositionHelper.isPositionBeforeOrEqual(c, a)).toBe(false);
});

test('isRangeWithinLocationRange', () => {
    /*
     * Outer range: 1-based start (line 1, column 3) => 0-based (0, 2);
     * 1-based end (line 3, column 5) => 0-based (2, 4)
     */
    const outer: LocationRange = {
        start: { line: 1, column: 3, offset: 2 },
        end: { line: 3, column: 5, offset: 20 },
        source: '',
    };

    // Inner range entirely within the outer range
    const innerWithin: Range = {
        start: { line: 0, character: 3 },
        end: { line: 2, character: 3 },
    };
    expect(PositionHelper.isRangeWithinLocationRange(innerWithin, outer)).toBe(true);

    // Inner range equal to the outer range
    const innerEqual: Range = {
        start: { line: 0, character: 2 },
        end: { line: 2, character: 4 },
    };
    expect(PositionHelper.isRangeWithinLocationRange(innerEqual, outer)).toBe(true);

    // Inner range starts before the outer range
    const innerStartsBefore: Range = {
        start: { line: 0, character: 1 },
        end: { line: 1, character: 2 },
    };
    expect(PositionHelper.isRangeWithinLocationRange(innerStartsBefore, outer)).toBe(false);

    // Inner range ends after the outer range
    const innerEndsAfter: Range = {
        start: { line: 1, character: 2 },
        end: { line: 2, character: 5 },
    };
    expect(PositionHelper.isRangeWithinLocationRange(innerEndsAfter, outer)).toBe(false);

    // Inner range extends beyond both the start and end of the outer range
    const innerSpansBeyond: Range = {
        start: { line: 0, character: 1 },
        end: { line: 2, character: 5 },
    };
    expect(PositionHelper.isRangeWithinLocationRange(innerSpansBeyond, outer)).toBe(false);
});
