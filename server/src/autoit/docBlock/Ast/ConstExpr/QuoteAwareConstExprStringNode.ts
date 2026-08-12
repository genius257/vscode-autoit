import { derive } from '@traits-ts/core';
import ConstExprNode from './ConstExprNode';
import NodeAttributes from '../NodeAttributes';
import ConstExprStringNode from './ConstExprStringNode';
import { addcslashes, sprintf } from 'locutus/php/strings';

export enum QuoteAwareConstExprStringNodeQuoted {
    SINGLE_QUOTED = 1,
    DOUBLE_QUOTED = 2,
}

export default class QuoteAwareConstExprStringNode extends derive(NodeAttributes, ConstExprStringNode) implements ConstExprNode {
    public quoteType: QuoteAwareConstExprStringNodeQuoted;

    public constructor(value: string, quoteType: QuoteAwareConstExprStringNodeQuoted) {
        super(value);

        this.quoteType = quoteType;
    }

    public override toString(): string {
        if (this.quoteType === QuoteAwareConstExprStringNodeQuoted.SINGLE_QUOTED) {
            // from https://github.com/nikic/PHP-Parser/blob/0ffddce52d816f72d0efc4d9b02e276d3309ef01/lib/PhpParser/PrettyPrinter/Standard.php#L1007
            return sprintf("'%s'", addcslashes(this.value, '\'\\')).toString();
        }

        // from https://github.com/nikic/PHP-Parser/blob/0ffddce52d816f72d0efc4d9b02e276d3309ef01/lib/PhpParser/PrettyPrinter/Standard.php#L1010-L1040
        return sprintf('"%s"', this.escapeDoubleQuotedString()).toString();
    }

    public escapeDoubleQuotedString(): string {
        const quote = '"';
        const escaped = addcslashes(this.value, '\n\r\t\f\v$' + quote + '\\');

        const pattern = [
            '[\\x00-\\x08\\x0E-\\x1F]', // Control characters
            '|[\\xC0-\\xC1]', // Invalid UTF-8 Bytes
            '|[\\xF5-\\xFF]', // Invalid UTF-8 Bytes
            '|\\xE0(?=[\\x80-\\x9F])', // Overlong encoding of prior code point
            '|\\xF0(?=[\\x80-\\x8F])', // Overlong encoding of prior code point
            '|[\\xC2-\\xDF](?![\\x80-\\xBF])', // Invalid UTF-8 Sequence Start
            '|[\\xE0-\\xEF](?![\\x80-\\xBF]{2})', // Invalid UTF-8 Sequence Start
            '|[\\xF0-\\xF4](?![\\x80-\\xBF]{3})', // Invalid UTF-8 Sequence Start
            '|(?<=[\\x00-\\x7F\\xF5-\\xFF])[\\x80-\\xBF]', // Invalid UTF-8 Sequence Middle
            '|(?<![\\xC2-\\xDF]|[\\xE0-\\xEF]|[\\xE0-\\xEF][\\x80-\\xBF]|[\\xF0-\\xF4]|[\\xF0-\\xF4][\\x80-\\xBF]|[\\xF0-\\xF4][\\x80-\\xBF]{2})[\\x80-\\xBF]', // Overlong Sequence
            '|(?<=[\\xE0-\\xEF])[\\x80-\\xBF](?![\\x80-\\xBF])', // Short 3 byte sequence
            '|(?<=[\\xF0-\\xF4])[\\x80-\\xBF](?![\\x80-\\xBF]{2})', // Short 4 byte sequence
            '|(?<=[\\xF0-\\xF4][\\x80-\\xBF])[\\x80-\\xBF](?![\\x80-\\xBF])', // Short 4 byte sequence (2)
        ].join('');

        return escaped.replace(new RegExp(pattern, 'g'), (match) => {
            const hex = match.charCodeAt(0).toString(16);

            return '\\x' + hex.padStart(2, '0');
        });
    }
}
