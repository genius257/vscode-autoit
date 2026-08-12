import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';

export default class NullableTypeNode extends derive(NodeAttributes) implements TypeNode {
    public type: TypeNode;

    public constructor(type: TypeNode) {
        super();

        this.type = type;
    }

    public override toString(): string {
        return '?' + this.type.toString();
    }
}
