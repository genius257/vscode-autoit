import Tag from '../Tag';
import Formatter from './Formatter';
import PassthroughFormatter from './Formatter/PassthroughFormatter';

export default class InvalidTag extends Tag {
    private name: string;

    private body: string;

    private throwable: unknown;// FIXME

    private constructor(name: string, body: string) {
        super();
        this.name = name;
        this.body = body;
    }

    public getException(): unknown | null {
        return this.throwable;
    }

    public getName(): string {
        return this.name;
    }

    public static override create(body: string, name: string = ''): InvalidTag {
        return new this(name, body);
    }

    public withError(exception: unknown): InvalidTag {
        // this.flattenExceptionBacktrace(exception);
        const tag = new InvalidTag(this.name, this.body);
        tag.throwable = exception;

        return tag;
    }

    // private flattenExceptionBacktrace(exception: unknown): void

    // private flattenArguments(value: unknown): unknown

    public render(formatter: Formatter | null = null): string {
        if (formatter === null) {
            formatter = new PassthroughFormatter();
        }

        return formatter.format(this);
    }

    public toString(): string {
        return this.body;
    }
}
