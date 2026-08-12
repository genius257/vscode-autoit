import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import NullableTypeNode from './NullableTypeNode';

export default class IntersectionTypeNode extends derive(NodeAttributes) implements TypeNode {
    public types: TypeNode[];

    public constructor(types: TypeNode[]) {
        super();

        this.types = types;
    }

    public override toString(): string {
        return `(${this.types.map((type: TypeNode): string => {
            if (type instanceof NullableTypeNode) {
                return `(${type.toString()})`;
            }

            return type.toString();
        }).join(' & ')})`;
    }
}
