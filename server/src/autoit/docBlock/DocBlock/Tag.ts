import type Formatter from './Tags/Formatter';

export default abstract class Tag {
    public abstract getName(): string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static create(body: string): Tag | null {
        // static method cannot be abstract, currently
        throw new Error('Not implemented');
    }

    public abstract render(formatter?: Formatter): string;

    public abstract toString(): string;
}

export type TagLike = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...$args: any[]): Tag,
    prototype: Tag,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(body: string, ...v: any[]): Tag | null,
};
