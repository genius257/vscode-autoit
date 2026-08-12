import { derive } from '@traits-ts/core';
import ConstExprNode from './ConstExprNode';
import NodeAttributes from '../NodeAttributes';
import { sprintf } from 'locutus/php/strings';

export default class ConstExprArrayItemNode extends derive(NodeAttributes) implements ConstExprNode {
    public key: ConstExprNode | null;
    public value: ConstExprNode;

    public constructor(key: ConstExprNode | null, value: ConstExprNode) {
        super();

        this.key = key;
        this.value = value;
    }

    public override toString(): string {
        if (this.key === null) {
            return sprintf('%s => %s', this.key, this.value.toString()).toString();
        }

        return this.value.toString();
    }
}
