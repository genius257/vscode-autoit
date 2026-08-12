import { derive } from '@traits-ts/core';
import NodeAttributes from '../NodeAttributes';
import ConstExprStringNode from './ConstExprStringNode';
import { sprintf, str_replace, strlen, substr } from 'locutus/php/strings';

export default class DoctrineConstExprStringNode extends derive(NodeAttributes, ConstExprStringNode) {
    public override value: string;

    public constructor(value: string) {
        super(value);

        this.value = value;
    }

    public override toString(): string {
        return (this.constructor as unknown as typeof DoctrineConstExprStringNode).escape(this.value);
    }

    public static unescape(value: string): string {
        // from https://github.com/doctrine/annotations/blob/a9ec7af212302a75d1f92fa65d3abfbd16245a2a/lib/Doctrine/Common/Annotations/DocLexer.php#L103-L107
        return str_replace('""', '"', substr(value, 1, strlen(value) - 2).toString()).toString();
    }

    public static escape(value: string): string {
        // from https://github.com/phpstan/phpdoc-parser/issues/205#issuecomment-1662323656
        return sprintf('"%s"', str_replace('"', '""', value).toString()).toString();
    }
}
