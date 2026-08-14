import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import ConstExprStringNode from '../ConstExpr/ConstExprStringNode';
import IdentifierTypeNode from './IdentifierTypeNode';
import { sprintf } from 'locutus/php/strings';

export default class ObjectShapeItemNode extends derive(NodeAttributes) implements TypeNode {
    public keyName: ConstExprStringNode | IdentifierTypeNode;
    public optional: boolean;
    public valueType: TypeNode;

    public constructor(keyName: ConstExprStringNode | IdentifierTypeNode, optional: boolean, valueType: TypeNode) {
        super();

        this.keyName = keyName;
        this.optional = optional;
        this.valueType = valueType;
    }

    public override toString(): string {
        return sprintf(
            '%s%s: %s',
            this.keyName.toString(),
            this.optional ? '?' : '',
            this.valueType.toString(),
        ).toString();

        return this.valueType.toString();
    }
}
