// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class StringUnescaper {
    private static readonly REPLACEMENTS: Record<string, string> = {
        '\\': '\\',
        n: '\n',
        r: '\r',
        t: '\t',
        f: '\f',
        v: '\v',
        e: '\x1B',
    };

    public static unescapeString(str: string): string {
        const quote = str[0];
        const content = str.substring(1, str.length - 1);

        if (quote === "'") {
            return content.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
        }

        return this.parseEscapeSequences(content, '"');
    }

    private static parseEscapeSequences(str: string, quote: string): string {
        const escapedQuote = new RegExp(`\\\\${quote}`, 'g');
        const internalStr = str.replace(escapedQuote, quote);

        return internalStr.replace(
            /\\([\\nrtfve]|[xX][0-9a-fA-F]{1,2}|[0-7]{1,3}|u\{([0-9a-fA-F]+)\})/g,
            (match, sequence: string, unicodeCp?: string) => {
                if (this.REPLACEMENTS[sequence] !== undefined) {
                    return this.REPLACEMENTS[sequence];
                }

                if (sequence.startsWith('x') || sequence.startsWith('X')) {
                    return String.fromCharCode(parseInt(sequence.substring(1), 16));
                }

                if (sequence.startsWith('u') && unicodeCp) {
                    return String.fromCodePoint(parseInt(unicodeCp, 16));
                }

                // Octal
                return String.fromCharCode(parseInt(sequence, 8));
            },
        );
    }
}
