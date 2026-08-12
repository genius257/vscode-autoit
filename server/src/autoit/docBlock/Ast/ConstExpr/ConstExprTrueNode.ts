import { derive } from '@traits-ts/core';
import NodeAttributes from '../NodeAttributes';
import ConstExprNode from './ConstExprNode';

export default class ConstExprTrueNode extends derive(NodeAttributes) implements ConstExprNode {
    public override toString(): string {
        return 'true';
    }
}
