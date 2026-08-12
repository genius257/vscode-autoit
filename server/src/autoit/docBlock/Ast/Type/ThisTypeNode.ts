import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import { derive } from '@traits-ts/core';

export default class ThisTypeNode extends derive(NodeAttributes) implements TypeNode {
    public override toString(): string {
        return '$this';
    }
}
