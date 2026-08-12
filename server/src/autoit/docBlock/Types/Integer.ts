import Type from '../Type';

/**
 * Value object representing Integer type
 */
export default class Integer implements Type {
    /**
     * Returns a rendered output of the Type as it would be used in a DocBlock.
     */
    public toString(): string {
        return 'int';
    }
}
