import Description from './Description';
import Factory from './Tags/Factory/Factory';
import TypeContext from '../Types/Context';
import Tag from './Tag';

export default class DescriptionFactory {
    private tagFactory: Factory;

    public constructor(tagFactory: Factory) {
        this.tagFactory = tagFactory;
    }

    public create(
        contents: string,
        context: TypeContext | null = null,
    ): Description {
        const tokens = this.lex(contents);
        const count = tokens.length;
        let tagCount = 0;
        const tags: Tag[] = [];

        for (let index = 1; index < count; index += 2) {
            tags.push(this.tagFactory.create(tokens[index]!, context));
            tokens[index] = `%${++tagCount}$s`;
        }

        /*
         * In order to allow "literal" inline tags, the otherwise invalid
         * sequence "{@}" is changed to "@", and "{}" is changed to "}".
         * "%" is escaped to "%%" because of vsprintf.
         * See unit tests for examples.
         */
        for (let index = 0; index < count; index += 2) {
            tokens[index] = tokens[index]!
                .replace(/{@}/g, '@')
                .replace(/{}/g, '}')
                .replace(/%/g, '%%');
        }

        return new Description(tokens.join(''), tags);
    }

    private lex(contents: string): string[] {
        contents = this.removeSuperfluousStartingWhitespace(contents);

        // performance optimalization; if there is no inline tag, don't bother splitting it up.
        if (!contents.includes('{@')) {
            return [contents];
        }

        /* eslint-disable @stylistic/indent, @stylistic/lines-around-comment, @stylistic/multiline-comment-style */
        // https://www.dormant.ninja/multiline-regex-in-javascript-with-comments/
        const regexParts: (RegExp | string)[] = [
            /\{/,
                // "{@}" is not a valid inline tag. This ensures that we do not treat it as one, but treat it literally.
                /(?!@\})/,
                // We want to capture the whole tag line, but without the inline tag delimiters.
                '(@',
                    // Match everything up to the next delimiter.
                    /[^{}]*/,
                    /* // BUG: the JS RegEx engine does not support numbered subpattern references, like (?1), so for now we are limited to one level of inline tags.
                    // Nested inline tag content should not be captured, or it will appear in the result separately.
                    "(?:",
                        // Match nested inline tags.
                        "(?:",
                            // Because we did not catch the tag delimiters earlier, we must be explicit with them here.
                            // Notice that this also matches "{}", as a way to later introduce it as an escape sequence.
                            '\\{(?1)?\\}',
                            "|",
                            // Make sure we match hanging "{".
                            /\{/,
                        ")",
                        // Match content after the nested inline tag.
                        /[^{}]/,
                    ")*", // If there are more inline tags, match them as well. We use "*" since there may not be any
                        // nested inline tags.
                    */
                ')',
            /\}/,
        ];
        /* eslint-enable @stylistic/indent, @stylistic/lines-around-comment, @stylistic/multiline-comment-style */

        return contents.split(new RegExp(regexParts.map((part) => (typeof part === 'string' ? part : part.source)).join(''), 'u'));
    }

    private removeSuperfluousStartingWhitespace(contents: string): string {
        const lines = contents.split(/\r\n?|\n/g);

        /*
         * if there is only one line then we don't have lines with superfluous whitespace and
         * can use the contents as-is
         */
        if (lines.length <= 1) {
            return contents;
        }

        // determine how many whitespace characters need to be stripped
        let startingSpaceCount = 9999999;

        for (let index = 1, iMax = lines.length; index < iMax; ++index) {
            // lines with a no length do not count as they are not indented at all
            if (lines[index]!.trim() === '') {
                continue;
            }

            /*
             * determine the number of prefixing spaces by checking the difference in line length before and after
             * an ltrim
             */
            startingSpaceCount = Math.min(
                startingSpaceCount,
                lines[index]!.length - lines[index]!.trimStart().length,
            );
        }

        // strip the number of spaces from each line
        if (startingSpaceCount > 0) {
            for (let index = 1, iMax = lines.length; index < iMax; ++index) {
                lines[index] = lines[index]!.substring(startingSpaceCount);
            }
        }

        return lines.join('\n');
    }
}
