import PseudoType from '../PseudoType';
import Type from '../Type';
import Integer from '../Types/Integer';

export default class IntegerValue implements PseudoType {
    private value: number;

    public constructor(value: number) {
        this.value = value;
    }

    public getValue(): number {
        return this.value;
    }

    public underlyingType(): Type {
        return new Integer();
    }

    public toString(): string {
        return this.value.toString();
    }
}
