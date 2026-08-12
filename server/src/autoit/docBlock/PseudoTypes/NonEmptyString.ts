import PseudoType from '../PseudoType';
import Type from '../Type';
import String_ from '../Types/String_';

export default class NonEmptyString extends String_ implements PseudoType {
    public underlyingType(): Type {
        return new String_();
    }

    public override toString(): string {
        return 'non-empty-string';
    }
}
