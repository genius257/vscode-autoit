import Fqsen from '../Fqsen';
import Type from '../Type';
import AbstractList from './AbstractList';

export default class Collection extends AbstractList {
    private fqsen: Fqsen | null;

    public constructor(fqsen: Fqsen | null, valueType: Type, keyType: Type | null = null) {
        super(valueType, keyType);

        this.fqsen = fqsen;
    }

    public getFqsen(): Fqsen | null {
        return this.fqsen;
    }

    public override toString(): string {
        const objectType = (this.fqsen ?? 'object').toString();

        if (this.keyType === null) {
            return objectType + '<' + this.valueType.toString() + '>';
        }

        return objectType + '<' + this.keyType.toString() + ',' + this.valueType.toString() + '>';
    }
}
