import { sprintf } from 'locutus/php/strings';
import PseudoType from '../PseudoType';
import Type from '../Type';
import String_ from '../Types/String_';

export default class StringValue implements PseudoType {
    private value: string;

    public constructor(value: string) {
        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }

    public underlyingType(): Type {
        return new String_();
    }

    public toString(): string {
        return sprintf('"%s"', this.value).toString();
    }
}
