import { expect, test } from 'vitest';
import { Location } from 'autoit3-pegjs';
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
