import PseudoType from '../PseudoType';
import Type from '../Type';
import Array_ from '../Types/Array_';
import Integer from '../Types/Integer';
import Mixed_ from '../Types/Mixed_';

export default class NonEmptyList extends Array_ implements PseudoType {
    public underlyingType(): Type {
        return new Array_();
    }

    public constructor(valueType: Type | null) {
        super(valueType, new Integer());
    }

    public override toString(): string {
        if (this.valueType instanceof Mixed_) {
            return 'non-empty-list';
        }

        return 'non-empty-list<' + this.valueType.toString() + '>';
    }
}
