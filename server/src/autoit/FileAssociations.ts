/*
 * Glob matching for `files.associations` entries, without external
 * dependencies. Patterns are tokenized and matched with a memoized matcher,
 * which bounds matching to O(path length * token count) and therefore
 * prevents catastrophic backtracking, no matter how many separated globstars
 * a pattern contains. Supported syntax: `*` (any characters except `/`),
 * `**` (any characters including `/`), `?` (a single character except `/`),
 * `[abc]` character classes (with `[a-c]` ranges) and `{a,b}` alternation.
 */

/** Maximum accepted glob pattern length, part of the pattern complexity bound. */
const maxAssociationPatternLength = 256;

/** Maximum number of variants produced by expanding `{a,b}` alternations. */
const maxAssociationPatternVariants = 8;

type AssociationToken =
    | { type: 'literal', 'char': string }
    | { type: 'singleStar' }
    | { type: 'globStar' }
    | { type: 'question' }
    | { type: 'class', members: Set<string>, ranges: [string, string][] };

const associationTokenCache = new Map<string, AssociationToken[][] | null>();

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
 * Whether the given path matches a `files.associations` glob pattern,
 * mirroring VSCode semantics: slash-less patterns match the basename at any
 * depth, slash-ful relative patterns additionally match at any depth, and
 * globstars match across path separators. Matching is case-insensitive,
 * since file paths may differ in case (e.g. Windows drive letters) between
 * configuration and watcher events.
 * @param path The file path to match; both `/` and `\` separators are accepted.
 * @param pattern The glob pattern to match against.
 * @returns Whether the path matches the pattern.
 */
export function matchAssociationPattern(path: string, pattern: string): boolean {
    const normalizedPath = path.replace(/\\/g, '/').toLowerCase();

    const variants = getPatternTokens(pattern);

    if (variants === null) {
        return false;
    }

    if (matchVariants(normalizedPath, variants)) {
        return true;
    }

    if (!pattern.includes('/')) {
        // Slash-less patterns match the basename at any depth
        const basename = normalizedPath.slice(normalizedPath.lastIndexOf('/') + 1);

        return matchVariants(basename, variants);
    }

    // Slash-ful relative patterns additionally match at any depth
    const anyDepthVariants = getPatternTokens(`**/${pattern}`);

    return anyDepthVariants !== null && matchVariants(normalizedPath, anyDepthVariants);
}

/**
 * Whether the given glob pattern can be used for matching: it tokenizes
 * within the complexity bound and with valid syntax (e.g. no reversed
 * character ranges). Rejected patterns never match, so files matched by
 * them are not indexed.
 * @param pattern The glob pattern to check.
 * @returns Whether the pattern can be used for matching.
 */
export function isAssociationPatternSupported(pattern: string): boolean {
    return getPatternTokens(pattern) !== null;
}

/**
 * Returns cached tokens for the given glob pattern, or null when the pattern
 * cannot be tokenized (e.g. a reversed character range) or exceeds the
 * complexity bound. Rejected patterns are cached as nonmatching, so they
 * never match.
 */
function getPatternTokens(pattern: string): AssociationToken[][] | null {
    const cached = associationTokenCache.get(pattern);

    if (cached !== undefined) {
        return cached;
    }

    let tokens: AssociationToken[][] | null = null;

    if (pattern.length <= maxAssociationPatternLength) {
        const variants = expandAssociationBraces(pattern);

        if (variants !== null) {
            const tokenized: AssociationToken[][] = [];

            let tokenizable = true;

            for (const variant of variants) {
                const variantTokens = tokenizeAssociationPattern(variant);

                if (variantTokens === null) {
                    tokenizable = false;

                    break;
                }

                tokenized.push(variantTokens);
            }

            if (tokenizable) {
                tokens = tokenized;
            }
        }
    }

    associationTokenCache.set(pattern, tokens);

    return tokens;
}

/**
 * Expands `{a,b}` alternations into separate glob patterns, so the matcher
 * only has to handle simple tokens. Returns null when the expansion exceeds
 * the variant cap, or when braces are nested or unterminated.
 */
function expandAssociationBraces(pattern: string): string[] | null {
    let variants: string[] = [''];

    let index = 0;

    while (index < pattern.length) {
        const char = pattern[index];

        if (char === undefined) {
            break;
        }

        if (char !== '{') {
            variants = variants.map((variant) => variant + char);

            index++;

            continue;
        }

        const end = pattern.indexOf('}', index + 1);

        const nested = pattern.indexOf('{', index + 1);

        if (end === -1) {
            return null;
        }

        if (nested !== -1 && nested < end) {
            return null;
        }

        const expanded: string[] = [];

        for (const variant of variants) {
            for (const alternative of pattern.slice(index + 1, end).split(',')) {
                expanded.push(variant + alternative);
            }
        }

        if (expanded.length > maxAssociationPatternVariants) {
            return null;
        }

        variants = expanded;

        index = end + 1;
    }

    return variants;
}

/**
 * Tokenizes a glob pattern without alternations into a matcher token list,
 * or null when the pattern uses unsupported syntax (e.g. a reversed
 * character range).
 */
function tokenizeAssociationPattern(pattern: string): AssociationToken[] | null {
    const tokens: AssociationToken[] = [];

    let index = 0;

    while (index < pattern.length) {
        const char = pattern[index];

        if (char === undefined) {
            break;
        }

        if (char === '*') {
            let run = 0;

            while (pattern[index] === '*') {
                run++;

                index++;
            }

            tokens.push(run >= 2 ? { type: 'globStar' } : { type: 'singleStar' });

            continue;
        }

        if (char === '?') {
            tokens.push({ type: 'question' });

            index++;

            continue;
        }

        if (char === '[') {
            const end = pattern.indexOf(']', index + 1);

            if (end === -1) {
                return null;
            }

            const parsed = parseAssociationClass(pattern.slice(index + 1, end));

            if (parsed === null) {
                return null;
            }

            tokens.push(parsed);

            index = end + 1;

            continue;
        }

        tokens.push({ type: 'literal', 'char': char.toLowerCase() });

        index++;
    }

    return tokens;
}

/**
 * Parses the content of a character class into members and ranges. A `-` is
 * treated as a range separator only when followed by another character,
 * mirroring regular expression class behavior; reversed ranges are rejected.
 */
function parseAssociationClass(content: string): AssociationToken | null {
    const members = new Set<string>();

    const ranges: [string, string][] = [];

    let index = 0;

    while (index < content.length) {
        const char = content[index];

        if (char === undefined) {
            break;
        }

        const rangeEnd = content[index + 2];

        if (content[index + 1] === '-' && rangeEnd !== undefined) {
            if (char.toLowerCase() > rangeEnd.toLowerCase()) {
                // Reversed ranges are rejected, mirroring the invalid regular expression behavior
                return null;
            }

            ranges.push([char.toLowerCase(), rangeEnd.toLowerCase()]);

            index += 3;

            continue;
        }

        members.add(char.toLowerCase());

        index++;
    }

    return { type: 'class', members: members, ranges: ranges };
}

/**
 * Matches a path against tokenized glob pattern variants using a memoized
 * matcher, which bounds matching to O(path length * token count) and
 * therefore prevents catastrophic backtracking.
 */
function matchVariants(path: string, variants: AssociationToken[][]): boolean {
    return variants.some((tokens) => matchTokens(path, tokens));
}

/**
 * Matches a path against a token list using a memoized matcher, so every
 * path position and token position combination is evaluated at most once.
 */
function matchTokens(path: string, tokens: AssociationToken[]): boolean {
    const memo = new Map<number, boolean>();

    const match = (pathIndex: number, tokenIndex: number): boolean => {
        const row = pathIndex * (tokens.length + 1);

        const key = row + tokenIndex;

        const cached = memo.get(key);

        if (cached !== undefined) {
            return cached;
        }

        let result = false;

        if (tokenIndex === tokens.length) {
            result = pathIndex === path.length;
        } else {
            const token = tokens[tokenIndex];

            if (token !== undefined) {
                if (token.type === 'literal') {
                    result = path[pathIndex] === token.char && match(pathIndex + 1, tokenIndex + 1);
                } else if (token.type === 'question') {
                    result = pathIndex < path.length && path[pathIndex] !== '/' && match(pathIndex + 1, tokenIndex + 1);
                } else if (token.type === 'class') {
                    result = matchClassToken(path, pathIndex, token) && match(pathIndex + 1, tokenIndex + 1);
                } else if (token.type === 'singleStar') {
                    result = matchSingleStar(path, pathIndex, tokenIndex, match);
                } else {
                    result = matchGlobStar(path, pathIndex, tokenIndex, match);
                }
            }
        }

        memo.set(key, result);

        return result;
    };

    return match(0, 0);
}

/**
 * Matches a class token against the character at the path position.
 */
function matchClassToken(path: string, pathIndex: number, token: Extract<AssociationToken, { type: 'class' }>): boolean {
    const char = path[pathIndex];

    if (char === undefined || char === '/') {
        return false;
    }

    return token.members.has(char) || token.ranges.some(([start, end]) => char >= start && char <= end);
}

/**
 * Matches a single star token: any run of characters excluding path
 * separators, delegating the remainder of both to the memoized matcher.
 */
function matchSingleStar(
    path: string,
    pathIndex: number,
    tokenIndex: number,
    match: (pathIndex: number, tokenIndex: number) => boolean,
): boolean {
    for (let index = pathIndex; ; index++) {
        if (match(index, tokenIndex + 1)) {
            return true;
        }

        if (index >= path.length || path[index] === '/') {
            return false;
        }
    }
}

/**
 * Matches a globstar token: any run of characters including path
 * separators, delegating the remainder of both to the memoized matcher.
 */
function matchGlobStar(
    path: string,
    pathIndex: number,
    tokenIndex: number,
    match: (pathIndex: number, tokenIndex: number) => boolean,
): boolean {
    for (let index = pathIndex; index <= path.length; index++) {
        if (match(index, tokenIndex + 1)) {
            return true;
        }
    }

    return false;
}
