import Type from '../Type';

/**
 * Value Object representing the return-type 'never'.
 *
 * Never is generally only used when working with return types as it signifies that the method that only
 * ever throw or exit.
 */
export default class Never_ implements Type {
    public toString(): string {
        return 'never';
    }
}
