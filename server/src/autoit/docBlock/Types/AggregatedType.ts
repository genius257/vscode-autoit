import IteratorAggregate from '../IteratorAggregate';
import Type from '../Type';

export default abstract class AggregatedType implements Type, IteratorAggregate<Type> {
    private types: Type[] = [];
    private token: string;

    public constructor(types: Type[], token: string) {
        for (const type of types) {
            this.add(type);
        }

        this.token = token;
    }

    /**
     * Returns the type at the given index.
     */
    public get(index: number): Type | null {
        if (!this.has(index)) {
            return null;
        }

        return this.types[index] ?? null;
    }

    /**
     * Tests if this compound type has a type with the given index.
     */
    public has(index: number): boolean {
        return index >= 0 && index < this.types.length;
    }

    /**
     * Tests if this compound type contains the given type.
     */
    public contains(type: Type): boolean {
        for (const typePart of this.types) {
            // if the type is duplicate; do not add it
            if (typePart.toString() === type.toString()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns a rendered output of the Type as it would be used in a DocBlock.
     */
    public toString(): string {
        return this.types.join(this.token);
    }

    public getIterator(): IterableIterator<Type> {
        return [...this.types].values();
    }

    private add(type: Type): void {
        if (type instanceof this.constructor) {
            for (const subType of this.getIterator()) {
                this.add(subType);
            }

            return;
        }

        // if the type is duplicate; do not add it
        if (this.contains(type)) {
            return;
        }

        this.types.push(type);
    }
}
