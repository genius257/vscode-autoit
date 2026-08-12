import Type from '../Type';

export default class CallableParameter implements Type {
    private type: Type;
    private $isReference: boolean;
    private $isVariadic: boolean;
    private $isOptional: boolean;
    private name: string | null;

    public constructor(type: Type, name: string | null = null, isReference: boolean = false, isVariadic: boolean = false, isOptional: boolean = false) {
        this.type = type;
        this.$isReference = isReference;
        this.$isVariadic = isVariadic;
        this.$isOptional = isOptional;
        this.name = name;
    }

    public getName(): string | null {
        return this.name;
    }

    public getType(): Type {
        return this.type;
    }

    public isReference(): boolean {
        return this.$isReference;
    }

    public isVariadic(): boolean {
        return this.$isVariadic;
    }

    public isOptional(): boolean {
        return this.$isOptional;
    }
}
