import PseudoType from '../PseudoType';
import Type from '../Type';
import String_ from '../Types/String_';

export default class NumericString extends String_ implements PseudoType {
    public underlyingType(): Type {
        return new String_();
    }

    public override toString(): string {
        return 'numeric-string';
    }
}
