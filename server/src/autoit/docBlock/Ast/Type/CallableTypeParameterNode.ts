import { derive } from '@traits-ts/core';
import NodeAttributes from '../NodeAttributes';
import Node from '../Node';
import TypeNode from './TypeNode';
import { trim } from 'locutus/php/strings';

export default class CallableTypeParameterNode extends derive(NodeAttributes) implements Node {
    public type: TypeNode;
    public isReference: boolean;
    public isVariadic: boolean;

    /** May be empty */
    public parameterName: string;
    public isOptional: boolean;

    public constructor(type: TypeNode, isReference: boolean, isVariadic: boolean, parameterName: string, isOptional: boolean) {
        super();

        this.type = type;
        this.isReference = isReference;
        this.isVariadic = isVariadic;
        this.parameterName = parameterName;
        this.isOptional = isOptional;
    }

    public override toString(): string {
        const type = '{$this->type} ';
        const isReference = this.isReference ? '&' : '';
        const isVariadic = this.isVariadic ? '...' : '';
        const isOptional = this.isOptional ? '=' : '';

        return trim(`${type}${isReference}${isVariadic}${this.parameterName}`) + isOptional;
    }
}
