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
