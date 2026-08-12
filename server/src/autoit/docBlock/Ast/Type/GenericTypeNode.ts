import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import IdentifierTypeNode from './IdentifierTypeNode';
import { sprintf } from 'locutus/php/strings';

export enum GenericTypeNodeVariance {
    VARIANCE_INVARIANT = 'invariant',
    VARIANCE_COVARIANT = 'covariant',
    VARIANCE_CONTRAVARIANT = 'contravariant',
    VARIANCE_BIVARIANT = 'bivariant',
}

export default class GenericTypeNode extends derive(NodeAttributes) implements TypeNode {
    public type: IdentifierTypeNode;
    public genericTypes: TypeNode[];
    public variances: GenericTypeNodeVariance[];

    public constructor(type: IdentifierTypeNode, genericTypes: TypeNode[], variances: GenericTypeNodeVariance[] = []) {
        super();

        this.type = type;
        this.genericTypes = genericTypes;
        this.variances = variances;
    }

    public override toString(): string {
        const genericTypes: string[] = [];

        for (const [index, type] of this.genericTypes.entries()) {
            const variance = this.variances[index] ?? GenericTypeNodeVariance.VARIANCE_INVARIANT;

            if (variance === GenericTypeNodeVariance.VARIANCE_INVARIANT) {
                genericTypes.push(type.toString());
            } else if (variance === GenericTypeNodeVariance.VARIANCE_BIVARIANT) {
                genericTypes.push('*');
            } else {
                genericTypes.push(sprintf('%s %s', variance, type.toString()).toString());
            }
        }

        return this.type.toString() + '<' + genericTypes.join(', ') + '>';
    }
}
