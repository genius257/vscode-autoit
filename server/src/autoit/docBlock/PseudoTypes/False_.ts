import PseudoType from '../PseudoType';
import Type from '../Type';
import Boolean from '../Types/Boolean';

export default class False_ extends Boolean implements PseudoType {
    public underlyingType(): Type {
        return new Boolean();
    }

    public override toString(): string {
        return 'false';
    }
}
