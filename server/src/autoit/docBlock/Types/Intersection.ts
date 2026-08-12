import Type from '../Type';
import AggregatedType from './AggregatedType';

/**
 * Value Object representing a Intersection Type.
 *
 * A Intersection Type is not so much a special keyword or object reference but is a series of Types that are separated
 * using an AND operator (`&`). This combination of types signifies that whatever is associated with this Intersection
 * type may contain a value with any of the given types.
 */
export default class Intersection extends AggregatedType {
    /**
     * Initializes a intersection type (i.e. `\A&\B`) and tests if the provided types all implement the Type interface.
     */
    public constructor(types: Type[]) {
        super(types, '&');
    }
}
