import Type from '../Type';

/**
 * Value Object representing the type 'string'.
 */
export default class String_ implements Type {
    /**
     * Returns a rendered output of the Type as it would be used in a DocBlock.
     */
    public toString(): string {
        return 'string';
    }
}
