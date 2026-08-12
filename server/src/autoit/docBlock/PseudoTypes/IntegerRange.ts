import PseudoType from '../PseudoType';
import Type from '../Type';
import Integer from '../Types/Integer';

export default class IntegerRange extends Integer implements PseudoType {
    private minValue: number;
    private maxValue: number;

    public constructor(minValue: number, maxValue: number) {
        super();

        this.minValue = minValue;
        this.maxValue = maxValue;
    }

    public underlyingType(): Type {
        return new Integer();
    }

    public getMinValue(): number {
        return this.minValue;
    }

    public getMaxValue(): number {
        return this.maxValue;
    }

    public override toString(): string {
        return 'int<' + this.minValue.toString() + ', ' + this.maxValue.toString() + '>';
    }
}
