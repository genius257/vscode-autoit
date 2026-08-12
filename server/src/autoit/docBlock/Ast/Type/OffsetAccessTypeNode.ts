import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import CallableTypeNode from './CallableTypeNode';
import ConstTypeNode from './ConstTypeNode';
import NullableTypeNode from './NullableTypeNode';

export default class OffsetAccessTypeNode extends derive(NodeAttributes) implements TypeNode {
    public type: TypeNode;
    public offset: TypeNode;

    public constructor(type: TypeNode, offset: TypeNode) {
        super();

        this.type = type;
        this.offset = offset;
    }

    public override toString(): string {
        if (
            this.type instanceof CallableTypeNode ||
            this.type instanceof ConstTypeNode ||
            this.type instanceof NullableTypeNode
        ) {
            return '(' + this.type.toString() + ')[' + this.offset.toString() + ']';
        }

        return this.type.toString() + '[' + this.offset.toString() + ']';
    }
}
