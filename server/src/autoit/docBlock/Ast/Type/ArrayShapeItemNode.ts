import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import IdentifierTypeNode from './IdentifierTypeNode';
import { sprintf } from 'locutus/php/strings';
import ConstExprIntegerNode from '../ConstExpr/ConstExprIntegerNode';
import ConstExprStringNode from '../ConstExpr/ConstExprStringNode';

export default class ArrayShapeItemNode extends derive(NodeAttributes) implements TypeNode {
    public keyName: ConstExprIntegerNode | ConstExprStringNode | IdentifierTypeNode | null;
    public optional: boolean;
    public valueType: TypeNode;

    public constructor(keyName: ConstExprIntegerNode | ConstExprStringNode | IdentifierTypeNode | null, optional: boolean, valueType: TypeNode) {
        super();

        this.keyName = keyName;
        this.optional = optional;
        this.valueType = valueType;
    }

    public override toString(): string {
        if (this.keyName !== null) {
            return sprintf(
                '%s%s: %s',
                this.keyName.toString(),
                this.optional ? '?' : '',
                this.valueType.toString(),
            ).toString();
        }

        return this.valueType.toString();
    }
}
