import Type from '../Type';
import CallableParameter from './CallableParameter';

export default class Callable_ implements Type {
    private returnType: Type | null;
    private parameters: CallableParameter[];

    public constructor(parameters: CallableParameter[], returnType: Type | null = null) {
        this.parameters = parameters;
        this.returnType = returnType;
    }

    public getParameters(): CallableParameter[] {
        return this.parameters;
    }

    public getReturnType(): Type | null {
        return this.returnType;
    }

    public toString(): string {
        return 'callable';
    }
}
