import { expect, test } from 'vitest';
import { getAu3AssociationPatterns, matchAssociationPattern } from './FileAssociations';

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
