import { expect, test } from 'vitest';
import { getAu3AssociationPatterns, isAssociationPatternSupported, matchAssociationPattern } from './FileAssociations';

test('getAu3AssociationPatterns extracts patterns mapped to the au3 language', () => {
    const patterns = getAu3AssociationPatterns({
        '*.myext': 'au3',
        '**/*.custom': 'au3',
        '*.other': 'javascript',
        'scripts/*.au3': 'au3',
    });

    expect(patterns).toEqual([
        '*.myext',
        '**/*.custom',
        'scripts/*.au3',
    ]);
});

test('getAu3AssociationPatterns returns an empty list for invalid values', () => {
    expect(getAu3AssociationPatterns(null)).toEqual([]);
    expect(getAu3AssociationPatterns(undefined)).toEqual([]);
    expect(getAu3AssociationPatterns('au3')).toEqual([]);
});

test('getAu3AssociationPatterns normalizes backslashes in patterns', () => {
    expect(getAu3AssociationPatterns({ 'scripts\\*.myext': 'au3' })).toEqual(['scripts/*.myext']);
});

test('matchAssociationPattern matches slash-less patterns on basenames at any depth', () => {
    expect(matchAssociationPattern('/ws/one.myext', '*.myext')).toBe(true);
    expect(matchAssociationPattern('/ws/deep/nested/two.myext', '*.myext')).toBe(true);
    expect(matchAssociationPattern('/ws/one.other', '*.myext')).toBe(false);
    expect(matchAssociationPattern('/ws/deep/three.myext.bak', '*.myext')).toBe(false);
});

test('matchAssociationPattern matches globstar patterns at any depth', () => {
    expect(matchAssociationPattern('/ws/one.custom', '**/*.custom')).toBe(true);
    expect(matchAssociationPattern('/ws/deep/two.custom', '**/*.custom')).toBe(true);
    expect(matchAssociationPattern('/ws/three.other', '**/*.custom')).toBe(false);
});

test('matchAssociationPattern matches slash-ful relative patterns at any depth', () => {
    expect(matchAssociationPattern('/ws/scripts/one.myext', 'scripts/*.myext')).toBe(true);
    expect(matchAssociationPattern('/ws/one.myext', 'scripts/*.myext')).toBe(false);
});

test('matchAssociationPattern is case-insensitive', () => {
    expect(matchAssociationPattern('/ws/ONE.MYEXT', '*.myext')).toBe(true);
    expect(matchAssociationPattern('/ws/one.myext', '*.MYEXT')).toBe(true);
});

test('matchAssociationPattern accepts backslash separators in paths', () => {
    expect(matchAssociationPattern('c:\\ws\\one.myext', '*.myext')).toBe(true);
});

test('matchAssociationPattern supports question mark, character classes and alternation', () => {
    expect(matchAssociationPattern('/ws/onea.myext', 'one?.myext')).toBe(true);
    expect(matchAssociationPattern('/ws/oneab.myext', 'one?.myext')).toBe(false);
    expect(matchAssociationPattern('/ws/oneb.myext', 'one[ab].myext')).toBe(true);
    expect(matchAssociationPattern('/ws/onec.myext', 'one[ab].myext')).toBe(false);
    expect(matchAssociationPattern('/ws/one.dat', '*.{dat,tsv}')).toBe(true);
    expect(matchAssociationPattern('/ws/one.tsv', '*.{dat,tsv}')).toBe(true);
    expect(matchAssociationPattern('/ws/one.csv', '*.{dat,tsv}')).toBe(false);
});

test('matchAssociationPattern returns false for patterns that cannot be tokenized', () => {
    // A reversed character range cannot be tokenized into a valid matcher
    expect(matchAssociationPattern('/ws/onea.myext', 'one[z-a].myext')).toBe(false);

    // The pattern is cached as nonmatching, so repeated matching stays safe
    expect(matchAssociationPattern('/ws/oneb.myext', 'one[z-a].myext')).toBe(false);
});

test('matchAssociationPattern keeps matching valid patterns after an invalid pattern was cached', () => {
    expect(matchAssociationPattern('/ws/onea.myext', 'one[z-a].myext')).toBe(false);
    expect(matchAssociationPattern('/ws/one.myext', '*.myext')).toBe(true);
});

test('matchAssociationPattern collapses redundant star runs and adjacent globstar segments', () => {
    expect(matchAssociationPattern('/ws/one.myext', '****.myext')).toBe(true);
    expect(matchAssociationPattern('/ws/deep/nested/one.myext', '**/**/**/one.myext')).toBe(true);
});

test('matchAssociationPattern rejects patterns exceeding the complexity bound', () => {
    // Longer than the allowed pattern length
    const longPattern = `${'x'.repeat(300)}.myext`;

    expect(matchAssociationPattern('/ws/xxx.myext', longPattern)).toBe(false);

    // More brace variants than the allowed maximum
    const manyVariants = `{${'a,'.repeat(9)}}.myext`;

    expect(matchAssociationPattern('/ws/a.myext', manyVariants)).toBe(false);

    // Nested braces are rejected
    expect(matchAssociationPattern('/ws/ab.myext', '{a{b,c}}.myext')).toBe(false);

    // Patterns within the bound keep matching
    expect(matchAssociationPattern('/ws/one.myext', '**/*.myext')).toBe(true);
});

test('matchAssociationPattern matches patterns with many separated stars', () => {
    // Previously rejected by the asterisk count; the bounded matcher handles it
    const manyAsterisks = `${'*a'.repeat(17)}.myext`;

    expect(isAssociationPatternSupported(manyAsterisks)).toBe(true);
    expect(matchAssociationPattern('/ws/' + 'a'.repeat(17) + '.myext', manyAsterisks)).toBe(true);
});

test('matchAssociationPattern completes bounded matching on a long near-miss path', () => {
    const pattern = '**/a/**/b/**/c/*.myext';

    // A long path matching the pattern structure except for the final segment
    const nearMissPath = `/ws/${'a/'.repeat(256)}b/${'c/'.repeat(256)}missing.myext2`;

    const start = Date.now();

    expect(matchAssociationPattern(nearMissPath, pattern)).toBe(false);

    // The memoized matcher completes in bounded time; a backtracking matcher would not
    expect(Date.now() - start).toBeLessThan(1000);
});

test('isAssociationPatternSupported reports whether a pattern can be used for matching', () => {
    expect(isAssociationPatternSupported('*.myext')).toBe(true);
    expect(isAssociationPatternSupported('**/*.myext')).toBe(true);
    expect(isAssociationPatternSupported('one[z-a].myext')).toBe(false);
    expect(isAssociationPatternSupported(`{${'a,'.repeat(9)}}.myext`)).toBe(false);
});
