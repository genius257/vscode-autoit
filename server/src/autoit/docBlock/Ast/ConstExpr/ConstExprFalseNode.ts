import { derive } from '@traits-ts/core';
import NodeAttributes from '../NodeAttributes';
import ConstExprNode from './ConstExprNode';

export default class ConstExprFalseNode extends derive(NodeAttributes) implements ConstExprNode {
    public override toString(): string {
        return 'false';
    }
}
