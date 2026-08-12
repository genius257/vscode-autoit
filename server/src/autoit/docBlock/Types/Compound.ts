import Type from '../Type';
import AggregatedType from './AggregatedType';

/**
 * Value Object representing a Compound Type.
 *
 * A Compound Type is not so much a special keyword or object reference but is a series of Types that are separated
 * using an OR operator (`|`). This combination of types signifies that whatever is associated with this compound type
 * may contain a value with any of the given types.
 */
export default class Compound extends AggregatedType implements Type {
    /**
     * Initializes a compound type (i.e. `string|int`) and tests if the provided types all implement the Type interface.
     */
    public constructor(types: Type[]) {
        super(types, '|');
    }
}
