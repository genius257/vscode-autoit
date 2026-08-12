import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import ArrayShapeItemNode from './ArrayShapeItemNode';

export enum ArrayShapeNodeKind {
    KIND_ARRAY = 'array',
    KIND_LIST = 'list',
}

export default class ArrayShapeNode extends derive(NodeAttributes) implements TypeNode {
    public items: ArrayShapeItemNode[];
    public sealed: boolean;
    public kind: ArrayShapeNodeKind;

    public constructor(items: ArrayShapeItemNode[], sealed: boolean = true, kind: ArrayShapeNodeKind = ArrayShapeNodeKind.KIND_ARRAY) {
        super();

        this.items = items;
        this.sealed = sealed;
        this.kind = kind;
    }

    public override toString(): string {
        const items: (ArrayShapeItemNode | string)[] = [...this.items];

        if (!this.sealed) {
            items.push('...');
        }

        return this.kind + '{' + items.join(', ') + '}';
    }
}
