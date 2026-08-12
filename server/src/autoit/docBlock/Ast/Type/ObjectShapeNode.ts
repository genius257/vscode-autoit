import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import ObjectShapeItemNode from './ObjectShapeItemNode';

export default class ObjectShapeNode extends derive(NodeAttributes) implements TypeNode {
    public items: ObjectShapeItemNode[];

    public constructor(items: ObjectShapeItemNode[]) {
        super();

        this.items = items;
    }

    public override toString(): string {
        const items = this.items;

        return 'object{' + items.join(', ') + '}';
    }
}
