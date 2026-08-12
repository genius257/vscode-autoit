import { derive } from '@traits-ts/core';
import NodeAttributes from '../NodeAttributes';
import ConstExprNode from './ConstExprNode';
import ConstExprArrayItemNode from './ConstExprArrayItemNode';

export default class ConstExprArrayNode extends derive(NodeAttributes) implements ConstExprNode {
    public items: ConstExprArrayItemNode[];

    public constructor(items: ConstExprArrayItemNode[]) {
        super();
        this.items = items;
    }

    public override toString(): string {
        return `[${this.items.join(', ')}]`;
    }
}
