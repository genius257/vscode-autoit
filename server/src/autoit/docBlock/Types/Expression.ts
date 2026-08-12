import Type from '../Type';

/**
 * Represents an expression type as described in the PSR-5, the PHPDoc Standard.
 */
export default class Expression implements Type {
    protected valueType: Type;

    /**
     * Initializes this representation of an array with the given Type.
     */
    public constructor(valueType: Type) {
        this.valueType = valueType;
    }

    /**
     * Returns the value for the keys of this array.
     */
    public getValueType(): Type {
        return this.valueType;
    }

    /**
     * Returns a rendered output of the Type as it would be used in a DocBlock.
     */
    public toString(): string {
        return '(' + this.valueType.toString() + ')';
    }
}
