import { derive } from '@traits-ts/core';
import TypeNode from './TypeNode';
import NodeAttributes from '../NodeAttributes';
import { sprintf } from 'locutus/php/strings';

export default class ConditionalTypeNode extends derive(NodeAttributes) implements TypeNode {
    public subjectType: TypeNode;
    public targetType: TypeNode;
    public if: TypeNode;
    public else: TypeNode;
    public negated: boolean;

    public constructor(subjectType: TypeNode, targetType: TypeNode, _if: TypeNode, _else: TypeNode, negated: boolean) {
        super();

        this.subjectType = subjectType;
        this.targetType = targetType;
        this.if = _if;
        this.else = _else;
        this.negated = negated;
    }

    public override toString(): string {
        return sprintf(
            '(%s %s %s ? %s : %s)',
            this.subjectType.toString(),
            this.negated ? 'is not' : 'is',
            this.targetType.toString(),
            this.if.toString(),
            this.else.toString(),
        ).toString();
    }
}
