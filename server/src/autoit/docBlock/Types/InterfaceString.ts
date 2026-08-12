import Fqsen from '../Fqsen';
import Type from '../Type';

/**
 * Value Object representing the type 'string'.
 */
export default class InterfaceString implements Type {
    private fqsen: Fqsen | null;

    public constructor(fqsen: Fqsen | null) {
        this.fqsen = fqsen;
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
    public toString(): string {
        if (this.fqsen === null) {
            return 'interface-string';
        }

        return 'interface-string<' + this.fqsen.toString() + '>';
    }
}
