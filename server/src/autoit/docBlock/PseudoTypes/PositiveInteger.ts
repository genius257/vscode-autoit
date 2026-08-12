import PseudoType from '../PseudoType';
import Type from '../Type';
import Integer from '../Types/Integer';

export default class PositiveInteger extends Integer implements PseudoType {
    public underlyingType(): Type {
        return new Integer();
    }

    public override toString(): string {
        return 'positive-int';
    }
}
