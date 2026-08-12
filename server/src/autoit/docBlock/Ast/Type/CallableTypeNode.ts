import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import IdentifierTypeNode from './IdentifierTypeNode';
import CallableTypeParameterNode from './CallableTypeParameterNode';
import { implode } from 'locutus/php/strings';

export default class CallableTypeNode extends derive(NodeAttributes) implements TypeNode {
    public identifier: IdentifierTypeNode;
    public parameters: CallableTypeParameterNode[];
    public returnType: TypeNode;

    public constructor(identifier: IdentifierTypeNode, parameters: CallableTypeParameterNode[], returnType: TypeNode) {
        super();

        this.identifier = identifier;
        this.parameters = parameters;
        this.returnType = returnType;
    }

    public override toString(): string {
        let returnType: TypeNode | string = this.returnType;

        if (returnType instanceof this.constructor) {
            returnType = `(${returnType.toString()})`;
        }

        const parameters = implode(', ', this.parameters);

        return `${this.identifier.toString()}(${parameters}): ${returnType.toString()}`;
    }
}
