import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import ConstExprNode from '../ConstExpr/ConstExprNode';

export default class ConstTypeNode extends derive(NodeAttributes) implements TypeNode {
    public constExpr: ConstExprNode;

    public constructor(constExpr: ConstExprNode) {
        super();

        this.constExpr = constExpr;
    }

    public override toString(): string {
        return this.constExpr.toString();
    }
}
