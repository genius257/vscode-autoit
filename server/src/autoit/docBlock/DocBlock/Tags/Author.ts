import BaseTag from "./BaseTag";

export default class Author extends BaseTag {
    protected override name: string = 'author';

    private authorName: string;

    private authorEmail: string;

    public constructor(authorName: string, authorEmail: string) {
        super();
        this.authorName = authorName;
        this.authorEmail = authorEmail;
    }

    public getAuthorName(): string {
        return this.authorName;
    }

    public getEmail(): string {
        return this.authorEmail;
    }

    static override create(body: string): Author|null {
        const splitTagContent = body.match(/^([^<]*)(?:<([^>]*)>)?$/u);

        if (splitTagContent === null) {
            return null;
        }

        const authorName = splitTagContent[1].trim();
        const authorEmail = splitTagContent[2]?.trim() ?? '';

        return new this(authorName, authorEmail);
    }

    public toString(): string {
        let authorEmail = '';

        if (this.authorEmail) {//FIXME
            authorEmail = `<${this.authorEmail}>`;
        }

        return [this.authorName, authorEmail].filter(value => value).join(' ');
    }
}
