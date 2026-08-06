import type Formatter from './Tags/Formatter';

export default abstract class Tag {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static create(body: string): Tag | null {
        // static method cannot be abstract, currently
        throw new Error('Not implemented');
    }

    public abstract getName(): string;

    public abstract render(formatter?: Formatter): string;

    public abstract toString(): string;
}

export type TagLike = {
    prototype: Tag,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...$args: any[]): Tag,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(body: string, ...v: any[]): Tag | null,
};
