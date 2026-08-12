import PseudoType from '../PseudoType';
import Type from '../Type';
import AggregatedType from '../Types/AggregatedType';
import Compound from '../Types/Compound';
import Float_ from '../Types/Float_';
import Integer from '../Types/Integer';
import NumericString from './NumericString';

export default class Numeric_ extends AggregatedType implements PseudoType {
    public constructor() {
        super([
            new NumericString(),
            new Integer(),
            new Float_(),
        ], '|');
    }

    public underlyingType(): Type {
        return new Compound([
            new NumericString(),
            new Integer(),
            new Float_(),
        ]);
    }

    public override toString(): string {
        return 'numeric';
    }
}
