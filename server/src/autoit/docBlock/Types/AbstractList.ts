// phpDocumentor\Reflection\Type

import Type from '../Type';
import Compound from './Compound';
import Integer from './Integer';
import Mixed_ from './Mixed_';
import String_ from './String_';

export default class AbstractList implements Type {
    protected valueType: Type;
    protected keyType: Type | null;
    protected defaultKeyType: Type;

    /**
     * Initializes this representation of an array with the given Type.
     */
    public constructor(valueType: Type | null = null, keyType: Type | null = null) {
        valueType ??= new Mixed_();

        this.valueType = valueType;
        this.defaultKeyType = new Compound([new String_(), new Integer()]);
        this.keyType = keyType;
    }

    /**
     * Returns the type for the keys of this array.
     */
    public getKeyType(): Type {
        return this.keyType ?? this.defaultKeyType;
    }

    /**
     * Returns a rendered output of the Type as it would be used in a DocBlock.
     */
    public toString(): string {
        if (this.keyType) {
            return 'array<' + this.keyType.toString() + ',' + this.valueType.toString() + '>';
        }

        if (this.valueType instanceof Mixed_) {
            return 'array';
        }

        if (this.valueType instanceof Compound) {
            return '(' + this.valueType.toString() + ')[]';
        }

        return this.valueType.toString() + '[]';
    }
}
