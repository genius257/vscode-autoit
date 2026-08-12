import PseudoType from '../PseudoType';
import Type from '../Type';
import Float_ from '../Types/Float_';

export default class FloatValue implements PseudoType {
    private value: number;

    public constructor(value: number) {
        this.value = value;
    }

    public getValue(): number {
        return this.value;
    }

    public underlyingType(): Type {
        return new Float_();
    }

    public toString(): string {
        return this.value.toString();
    }
}
