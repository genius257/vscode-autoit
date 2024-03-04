import Tag from "./Tag";
import Formatter from "./Tags/Formatter";
import PassthroughFormatter from "./Tags/Formatter/PassthroughFormatter";

export default class Description {
    private bodyTemplate: string;

    private tags: Tag[];

    public constructor(bodyTemplate: string, tags: Tag[] = []) {
        this.bodyTemplate = bodyTemplate;
        this.tags = tags;
    }

    public getBodyTemplate(): string {
        return this.bodyTemplate;
    }

    public getTags(): Readonly<Tag[]> {
        return this.tags;
    }

    public render(formatter: Formatter|null = null): string {
        if (this.tags.length === 0) {
            return this.bodyTemplate;
        }

        if (formatter === null) {
            formatter = new PassthroughFormatter();
        }

        const tags = this.tags.map(tag => `{${formatter!.format}}`);

        return this.bodyTemplate
            .replace(
                /{(\d+)}/g,
                (match, number) => tags[number] ?? match
            ); // https://stackoverflow.com/a/4673436/3958400
    }

    public toString(): string {
        return this.render();
    }
}
