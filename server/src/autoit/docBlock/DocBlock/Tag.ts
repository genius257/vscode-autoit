import type Formatter from './Tags/Formatter';

export default abstract class Tag {
    public abstract getName(): string;

    public static create(body: string): Tag | null {
        // static method cannot be abstract, currently
        throw new Error('Not implemented');
    }

    public abstract render(formatter?: Formatter): string;

    public abstract toString(): string;
}

export type TagLike = {
    new (...$args: unknown[]): Tag,
    prototype: Tag,
    create(body: string, ...v: unknown[]): Tag | null,
};
