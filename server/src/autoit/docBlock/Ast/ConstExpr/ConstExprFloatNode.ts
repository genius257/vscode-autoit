import { derive } from '@traits-ts/core';
import NodeAttributes from '../NodeAttributes';
import ConstExprNode from './ConstExprNode';

export default class ConstExprFloatNode extends derive(NodeAttributes) implements ConstExprNode {
    public value: string;

    public constructor(value: string) {
        super();

        this.value = value;
    }

    public override toString(): string {
        return this.value;
    }
}
