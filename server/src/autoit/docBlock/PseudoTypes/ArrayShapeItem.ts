import { sprintf } from 'locutus/php/strings';
import Type from '../Type';
import Mixed_ from '../Types/Mixed_';

export default class ArrayShapeItem {
    private key: string | null;
    private value: Type;
    private optional: boolean;

    public constructor(key: string | null, value: Type | null, optional: boolean) {
        this.key = key;
        this.value = value ?? new Mixed_();
        this.optional = optional;
    }

    public getKey(): string | null {
        return this.key;
    }

    public getValue(): Type {
        return this.value;
    }

    public isOptional(): boolean {
        return this.optional;
    }

    public toString(): string {
        if (this.key !== null) {
            return sprintf(
                '%s%s: %s',
                this.key,
                this.optional ? '?' : '',
                this.value.toString(),
            ).toString();
        }

        return this.value.toString();
    }
}
