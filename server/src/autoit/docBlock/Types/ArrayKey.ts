import PseudoType from '../PseudoType';
import Type from '../Type';
import AggregatedType from './AggregatedType';
import Compound from './Compound';
import Integer from './Integer';
import String_ from './String_';

export default class ArrayKey extends AggregatedType implements PseudoType {
    public constructor() {
        super([new String_(), new Integer()], '|');
    }

    public underlyingType(): Type {
        return new Compound([new String_(), new Integer()]);
    }

    public override toString(): string {
        return 'array-key';
    }
}
