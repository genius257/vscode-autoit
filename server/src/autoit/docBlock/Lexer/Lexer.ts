export enum TokenType {
    TOKEN_REFERENCE = 0,
    TOKEN_UNION = 1,
    TOKEN_INTERSECTION = 2,
    TOKEN_NULLABLE = 3,
    TOKEN_OPEN_PARENTHESES = 4,
    TOKEN_CLOSE_PARENTHESES = 5,
    TOKEN_OPEN_ANGLE_BRACKET = 6,
    TOKEN_CLOSE_ANGLE_BRACKET = 7,
    TOKEN_OPEN_SQUARE_BRACKET = 8,
    TOKEN_CLOSE_SQUARE_BRACKET = 9,
    TOKEN_COMMA = 10,
    TOKEN_VARIADIC = 11,
    TOKEN_DOUBLE_COLON = 12,
    TOKEN_DOUBLE_ARROW = 13,
    TOKEN_EQUAL = 14,
    TOKEN_OPEN_PHPDOC = 15,
    TOKEN_CLOSE_PHPDOC = 16,
    TOKEN_PHPDOC_TAG = 17,
    TOKEN_DOCTRINE_TAG = 18,
    TOKEN_FLOAT = 19,
    TOKEN_INTEGER = 20,
    TOKEN_SINGLE_QUOTED_STRING = 21,
    TOKEN_DOUBLE_QUOTED_STRING = 22,
    TOKEN_DOCTRINE_ANNOTATION_STRING = 23,
    TOKEN_IDENTIFIER = 24,
    TOKEN_THIS_VARIABLE = 25,
    TOKEN_VARIABLE = 26,
    TOKEN_HORIZONTAL_WS = 27,
    TOKEN_PHPDOC_EOL = 28,
    TOKEN_OTHER = 29,
    TOKEN_END = 30,
    TOKEN_COLON = 31,
    TOKEN_WILDCARD = 32,
    TOKEN_OPEN_CURLY_BRACKET = 33,
    TOKEN_CLOSE_CURLY_BRACKET = 34,
    TOKEN_NEGATED = 35,
    TOKEN_ARROW = 36,
}

export enum TokenOffset {
    VALUE_OFFSET = 0,
    TYPE_OFFSET = 1,
    LINE_OFFSET = 2,
}

export default class Lexer {
    public static readonly TOKEN_LABELS: Record<TokenType, string> = {
        [TokenType.TOKEN_REFERENCE]: "'&'",
        [TokenType.TOKEN_UNION]: "'|'",
        [TokenType.TOKEN_INTERSECTION]: "'&'",
        [TokenType.TOKEN_NULLABLE]: "'?'",
        [TokenType.TOKEN_NEGATED]: "'!'",
        [TokenType.TOKEN_OPEN_PARENTHESES]: "'('",
        [TokenType.TOKEN_CLOSE_PARENTHESES]: "')'",
        [TokenType.TOKEN_OPEN_ANGLE_BRACKET]: "'<'",
        [TokenType.TOKEN_CLOSE_ANGLE_BRACKET]: "'>'",
        [TokenType.TOKEN_OPEN_SQUARE_BRACKET]: "'['",
        [TokenType.TOKEN_CLOSE_SQUARE_BRACKET]: "']'",
        [TokenType.TOKEN_OPEN_CURLY_BRACKET]: "'{'",
        [TokenType.TOKEN_CLOSE_CURLY_BRACKET]: "'}'",
        [TokenType.TOKEN_COMMA]: "','",
        [TokenType.TOKEN_COLON]: "':'",
        [TokenType.TOKEN_VARIADIC]: "'...'",
        [TokenType.TOKEN_DOUBLE_COLON]: "'::'",
        [TokenType.TOKEN_DOUBLE_ARROW]: "'=>'",
        [TokenType.TOKEN_ARROW]: "'->'",
        [TokenType.TOKEN_EQUAL]: "'='",
        [TokenType.TOKEN_OPEN_PHPDOC]: "'/**'",
        [TokenType.TOKEN_CLOSE_PHPDOC]: "'*/'",
        [TokenType.TOKEN_PHPDOC_TAG]: 'TOKEN_PHPDOC_TAG',
        [TokenType.TOKEN_DOCTRINE_TAG]: 'TOKEN_DOCTRINE_TAG',
        [TokenType.TOKEN_PHPDOC_EOL]: 'TOKEN_PHPDOC_EOL',
        [TokenType.TOKEN_FLOAT]: 'TOKEN_FLOAT',
        [TokenType.TOKEN_INTEGER]: 'TOKEN_INTEGER',
        [TokenType.TOKEN_SINGLE_QUOTED_STRING]: 'TOKEN_SINGLE_QUOTED_STRING',
        [TokenType.TOKEN_DOUBLE_QUOTED_STRING]: 'TOKEN_DOUBLE_QUOTED_STRING',
        [TokenType.TOKEN_DOCTRINE_ANNOTATION_STRING]:
    'TOKEN_DOCTRINE_ANNOTATION_STRING',
        [TokenType.TOKEN_IDENTIFIER]: 'type',
        [TokenType.TOKEN_THIS_VARIABLE]: "'$this'",
        [TokenType.TOKEN_VARIABLE]: 'variable',
        [TokenType.TOKEN_HORIZONTAL_WS]: 'TOKEN_HORIZONTAL_WS',
        [TokenType.TOKEN_OTHER]: 'TOKEN_OTHER',
        [TokenType.TOKEN_END]: 'TOKEN_END',
        [TokenType.TOKEN_WILDCARD]: '*',
    };

    private parseDoctrineAnnotations: boolean;
    private regexp: RegExp | null = null;

    public constructor(parseDoctrineAnnotations = false) {
        this.parseDoctrineAnnotations = parseDoctrineAnnotations;
    }

    public tokenize(s: string): [string, TokenType, number][] {
        this.regexp ??= this.generateRegexp();

        const tokens: [string, TokenType, number][] = [];
        let line = 1;

        for (const match of s.matchAll(this.regexp)) {
            const type = this.resolveTokenType(match.groups);

            tokens.push([
                match[0],
                type,
                line,
            ]);

            if (type === TokenType.TOKEN_PHPDOC_EOL) {
                line++;
            }
        }

        tokens.push([
            '',
            TokenType.TOKEN_END,
            line,
        ]);

        return tokens;
    }

    /**
     * Resolves the token type from named match groups.
     *
     * The upstream PHP implementation uses PCRE's `(*MARK:type)` control verb,
     * which records the token-type integer directly as `$match['MARK']`.
     * JavaScript regex does not support `(*MARK:)`, so each pattern is wrapped
     * in a named capture group `(?<MARK_{type}>…)` instead, and the matching
     * group is used to infer the token type.
     *
     * @see https://github.com/phpstan/phpdoc-parser/blob/bd84b629c8de41aa2ae82c067c955e06f1b00240/src/Lexer/Lexer.php
     */
    private resolveTokenType(groups: Record<string, string | undefined> | undefined): TokenType {
        if (groups === undefined) {
            return TokenType.TOKEN_OTHER;
        }

        for (const [key, value] of Object.entries(groups)) {
            if (value !== undefined) {
                return parseInt(key.replace('MARK_', ''), 10) as TokenType;
            }
        }

        return TokenType.TOKEN_OTHER;
    }

    private generateRegexp(): RegExp {
        const patterns: Partial<Record<TokenType, string>> = {
            [TokenType.TOKEN_HORIZONTAL_WS]: '[\\t ]+',

            [TokenType.TOKEN_IDENTIFIER]:
        '(?:\\\\?[a-z_\\x80-\\xFF][0-9a-z_\\x80-\\xFF-]*)+',
            [TokenType.TOKEN_THIS_VARIABLE]: '\\$this(?![0-9a-z_\\x80-\\xFF])',
            [TokenType.TOKEN_VARIABLE]: '\\$[a-z_\\x80-\\xFF][0-9a-z_\\x80-\\xFF]*',

            // '&' followed by TOKEN_VARIADIC, TOKEN_VARIABLE, TOKEN_EQUAL, TOKEN_EQUAL or TOKEN_CLOSE_PARENTHESES
            [TokenType.TOKEN_REFERENCE]:
        '&(?=\\s*(?:[.,=)]|(?:\\$(?!this(?![0-9a-z_\\x80-\\xFF])))))',
            [TokenType.TOKEN_UNION]: '\\|',
            [TokenType.TOKEN_INTERSECTION]: '&',
            [TokenType.TOKEN_NULLABLE]: '\\?',
            [TokenType.TOKEN_NEGATED]: '!',

            [TokenType.TOKEN_OPEN_PARENTHESES]: '\\(',
            [TokenType.TOKEN_CLOSE_PARENTHESES]: '\\)',
            [TokenType.TOKEN_OPEN_ANGLE_BRACKET]: '<',
            [TokenType.TOKEN_CLOSE_ANGLE_BRACKET]: '>',
            [TokenType.TOKEN_OPEN_SQUARE_BRACKET]: '\\[',
            [TokenType.TOKEN_CLOSE_SQUARE_BRACKET]: '\\]',
            [TokenType.TOKEN_OPEN_CURLY_BRACKET]: '\\{',
            [TokenType.TOKEN_CLOSE_CURLY_BRACKET]: '\\}',

            [TokenType.TOKEN_COMMA]: ',',
            [TokenType.TOKEN_VARIADIC]: '\\.\\.\\.',
            [TokenType.TOKEN_DOUBLE_COLON]: '::',
            [TokenType.TOKEN_DOUBLE_ARROW]: '=>',
            [TokenType.TOKEN_ARROW]: '->',
            [TokenType.TOKEN_EQUAL]: '=',
            [TokenType.TOKEN_COLON]: ':',

            [TokenType.TOKEN_OPEN_PHPDOC]: '/\\*\\*(?=\\s) ?',
            [TokenType.TOKEN_CLOSE_PHPDOC]: '\\*/',
            [TokenType.TOKEN_PHPDOC_TAG]:
        '@(?:[a-z][a-z0-9-\\\\]+:)?[a-z][a-z0-9-\\\\]*',
            [TokenType.TOKEN_PHPDOC_EOL]: '\\r?\\n[\\t ]*(?:\\*(?!/)? )?',

            [TokenType.TOKEN_FLOAT]:
        '[+-]?(?:(?:[0-9]+(_[0-9]+)*\\.[0-9]*(_[0-9]+)*(?:e[+-]?[0-9]+(_[0-9]+)*)?)|(?:[0-9]*(_[0-9]+)*\\.[0-9]+(_[0-9]+)*(?:e[+-]?[0-9]+(_[0-9]+)*)?)|(?:[0-9]+(_[0-9]+)*e[+-]?[0-9]+(_[0-9]+)*))',
            [TokenType.TOKEN_INTEGER]:
        '[+-]?(?:(?:0b[01]+(_[01]+)*)|(?:0o[0-7]+(_[0-7]+)*)|(?:0x[0-9a-f]+(_[0-9a-f]+)*)|(?:[0-9]+(_[0-9]+)*))',
            [TokenType.TOKEN_SINGLE_QUOTED_STRING]: "'(?:\\\\.|[^'\\r\\n\\\\])*'",
            [TokenType.TOKEN_DOUBLE_QUOTED_STRING]: '"(?:\\\\.|[^"\\r\\n\\\\])*"',

            [TokenType.TOKEN_WILDCARD]: '\\*',
        };

        if (this.parseDoctrineAnnotations) {
            patterns[TokenType.TOKEN_DOCTRINE_TAG] =
        '@[a-z_\\\\][a-z0-9_:\\\\]*[a-z_][a-z0-9_]*';
            patterns[TokenType.TOKEN_DOCTRINE_ANNOTATION_STRING] = '"(?:""|[^"])*"';
        }

        patterns[TokenType.TOKEN_OTHER] = '(?:(?!\\*/)[^\\s])+';

        const parts = Object.entries(patterns).map(
            ([type, pattern]) => `(?<MARK_${type}>${pattern})`,
        );

        return new RegExp(parts.join('|'), 'giy');
    }
}
