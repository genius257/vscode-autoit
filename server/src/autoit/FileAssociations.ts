/*
 * Minimal glob matching for `files.associations` entries, without external
 * dependencies. Covers the glob subset used in practice: `*` (any characters
 * except `/`), `**` (any characters including `/`), `?` (a single character
 * except `/`), `[abc]` character classes and `{a,b}` alternation.
 */

const associationRegExpCache = new Map<string, RegExp | null>();

/** Maximum accepted glob pattern length, part of the pattern complexity bound. */
const maxAssociationPatternLength = 256;

/** Maximum total number of asterisks in a glob pattern, part of the pattern complexity bound. */
const maxAssociationPatternAsterisks = 16;

/**
 * Extracts all `files.associations` glob patterns mapped to the `au3` language.
 * @param associations The `files.associations` setting value.
 * @returns All patterns mapping files to the `au3` language.
 */
export function getAu3AssociationPatterns(associations: unknown): string[] {
    if (typeof associations !== 'object' || associations === null) {
        return [];
    }

    const patterns: string[] = [];

    for (const [pattern, languageId] of Object.entries(associations as Record<string, unknown>)) {
        if (languageId === 'au3') {
            patterns.push(pattern.replace(/\\/g, '/'));
        }
    }

    return patterns;
}

/**
 * Whether the given path matches a `files.associations` glob pattern, mirroring
 * VSCode semantics: slash-less patterns match the basename at any depth,
 * slash-ful relative patterns additionally match at any depth, and patterns
 * with a leading globstar segment match everywhere. Matching is
 * case-insensitive, since file paths may differ in case (e.g. Windows drive
 * letters) between configuration and watcher events.
 * @param path The file path to match; both forward and back slashes are accepted as separators.
 * @param pattern The glob pattern to match against.
 * @returns Whether the path matches the pattern.
 */
export function matchAssociationPattern(path: string, pattern: string): boolean {
    const normalizedPath = path.replace(/\\/g, '/');

    const regExp = getPatternRegExp(pattern);

    if (regExp === null) {
        return false;
    }

    if (regExp.test(normalizedPath)) {
        return true;
    }

    if (!pattern.includes('/')) {
        // Slash-less patterns match the basename at any depth
        const basename = normalizedPath.slice(normalizedPath.lastIndexOf('/') + 1);

        return regExp.test(basename);
    }

    // Slash-ful relative patterns additionally match at any depth
    const anyDepthRegExp = getPatternRegExp(`**/${pattern}`);

    return anyDepthRegExp?.test(normalizedPath) ?? false;
}

/**
 * Returns a cached regular expression for the given glob pattern, or null when
 * the pattern does not compile into a valid regular expression (e.g. a
 * reversed character range) or exceeds the complexity bound. Non-compiling
 * and rejected patterns are cached as nonmatching, so they never throw and
 * never match.
 */
function getPatternRegExp(pattern: string): RegExp | null {
    const cached = associationRegExpCache.get(pattern);

    if (cached !== undefined) {
        return cached;
    }

    let regExp: RegExp | null;

    if (isAssociationPatternComplexityAcceptable(pattern)) {
        try {
            regExp = new RegExp(`^${globToRegExpSource(normalizeAssociationPattern(pattern))}$`, 'i');
        } catch {
            regExp = null;
        }
    } else {
        regExp = null;
    }

    associationRegExpCache.set(pattern, regExp);

    return regExp;
}

/**
 * Normalizes a glob pattern before conversion, collapsing redundant star runs
 * of three or more asterisks and adjacent globstar segments, so no adjacent
 * greedy expressions (which could backtrack heavily on non-matching paths)
 * can be produced by the conversion.
 */
function normalizeAssociationPattern(pattern: string): string {
    return pattern
        .replace(/\*{3,}/g, '**')
        .replace(/(?:\*\*\/)+/g, '**/');
}

/**
 * Whether the pattern is within the defined complexity bound. Patterns with
 * excessive repeated globstars could otherwise produce regular expressions
 * with a high backtracking degree on non-matching paths.
 */
function isAssociationPatternComplexityAcceptable(pattern: string): boolean {
    if (pattern.length > maxAssociationPatternLength) {
        return false;
    }

    const asterisks = pattern.match(/\*/g)?.length ?? 0;

    return asterisks <= maxAssociationPatternAsterisks;
}

/**
 * Converts a glob into a regular expression source.
 */
function globToRegExpSource(pattern: string): string {
    let source = '';

    let index = 0;

    while (index < pattern.length) {
        const char = pattern[index];

        if (char === undefined) {
            break;
        }

        if (char === '*') {
            if (pattern[index + 1] === '*') {
                index += 2;

                /*
                 * A directory separator after a globstar is optional, so the
                 * pattern matches the file at the root as well as at any depth.
                 */
                if (pattern[index] === '/') {
                    source += '(?:.*/)?';

                    index++;
                } else {
                    source += '.*';
                }

                continue;
            }

            source += '[^/]*';

            index++;

            continue;
        }

        if (char === '?') {
            source += '[^/]';

            index++;

            continue;
        }

        if (char === '{') {
            const end = pattern.indexOf('}', index + 1);

            if (end !== -1) {
                const alternatives = pattern
                    .slice(index + 1, end)
                    .split(',')
                    .map((alternative) => escapeRegExp(alternative));

                source += `(?:${alternatives.join('|')})`;

                index = end + 1;

                continue;
            }
        }

        if (char === '[') {
            const end = pattern.indexOf(']', index + 1);

            if (end !== -1) {
                // Character classes are passed through as regular expression classes
                source += pattern.slice(index, end + 1);

                index = end + 1;

                continue;
            }
        }

        source += escapeRegExp(char);

        index++;
    }

    return source;
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
