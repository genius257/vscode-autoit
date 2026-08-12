import Fqsen from '../Fqsen';
import PseudoType from '../PseudoType';
import Type from '../Type';
import String_ from './String_';

export default class ClassString extends String_ implements PseudoType {
    private fqsen: Fqsen | null;

    public constructor(fqsen: Fqsen | null) {
        super();

        this.fqsen = fqsen;
    }

    public underlyingType(): Type {
        return new String_();
    }

    /**
     * Returns the FQSEN associated with this object.
     */
    public getFqsen(): Fqsen | null {
        return this.fqsen;
    }

    /**
     * Returns a rendered output of the Type as it would be used in a DocBlock.
     */
    public override toString(): string {
        if (this.fqsen === null) {
            return 'class-string';
        }

        return 'class-string<' + this.fqsen.toString() + '>';
    }
}
