import { derive } from '@traits-ts/core';
import ConstExprNode from './ConstExprNode';
import NodeAttributes from '../NodeAttributes';

export default class ConstExprStringNode extends derive(NodeAttributes) implements ConstExprNode {
    public value: string;

    public constructor(value: string) {
        super();

        this.value = value;
    }

    public override toString(): string {
        return this.value;
    }
}
