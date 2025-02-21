import Tag from './Tag';
import Formatter from './Tags/Formatter';
import PassthroughFormatter from './Tags/Formatter/PassthroughFormatter';
import vsprintf from 'locutus/php/strings/vsprintf';

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

    public getTags(): readonly Tag[] {
        return this.tags;
    }

    public render(formatter: Formatter | null = null): string {
        if (this.tags.length === 0) {
            return vsprintf(this.bodyTemplate, []);
        }

        if (formatter === null) {
            formatter = new PassthroughFormatter();
        }

        const tags = this.tags.map((tag) => `{${formatter.format(tag)}}`);

        return vsprintf(this.bodyTemplate, tags);
    }

    public toString(): string {
        return this.render();
    }
}
