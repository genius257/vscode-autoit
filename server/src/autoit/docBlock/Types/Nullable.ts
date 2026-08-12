import Type from '../Type';

export default class Nullable implements Type {
    /** The actual type that is wrapped */
    private realType: Type;

    public constructor(realType: Type) {
        this.realType = realType;
    }

    public getActualType(): Type {
        return this.realType;
    }

    public toString(): string {
        return '?' + this.realType.toString();
    }
}
