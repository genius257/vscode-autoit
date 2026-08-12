import { sprintf } from 'locutus/php/strings';
import PseudoType from '../PseudoType';
import Type from '../Type';
import Mixed_ from '../Types/Mixed_';

export default class ConstExpression implements PseudoType {
    private owner: Type;
    private expression: string;

    public constructor(owner: Type, expression: string) {
        this.owner = owner;
        this.expression = expression;
    }

    public getOwner(): Type {
        return this.owner;
    }

    public getExpression(): string {
        return this.expression;
    }

    public underlyingType(): Type {
        return new Mixed_();
    }

    public toString(): string {
        return sprintf('%s::%s', this.owner.toString(), this.expression).toString();
    }
}
