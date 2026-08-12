import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';

export default class IdentifierTypeNode extends derive(NodeAttributes) implements TypeNode {
    public name: string;

    public constructor(name: string) {
        super();
        this.name = name;
    }

    public override toString(): string {
        return this.name;
    }
}
