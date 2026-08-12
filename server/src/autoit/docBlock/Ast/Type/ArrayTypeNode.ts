import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import { derive } from '@traits-ts/core';
import CallableTypeNode from './CallableTypeNode';
import ConstTypeNode from './ConstTypeNode';
import NullableTypeNode from './NullableTypeNode';

export default class ArrayTypeNode extends derive(NodeAttributes) implements TypeNode {
    public type: TypeNode;

    public constructor(type: TypeNode) {
        super();
        this.type = type;
    }

    public override toString(): string {
        if (
            this.type instanceof CallableTypeNode ||
            this.type instanceof ConstTypeNode ||
            this.type instanceof NullableTypeNode
        ) {
            return `(${this.type.toString()})[]`;
        }

        return `${this.type.toString()}[]`;
    }
}
