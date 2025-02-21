import type { Location } from 'autoit3-pegjs';
import Description from './DocBlock/Description';
import Tag from './DocBlock/Tag';

type Context = symbol; // FIXME: currently not implemented

export default class DocBlock {
    public readonly summary: Description;
    public readonly description: Description;
    public readonly tags: Tag[] = [];
    public readonly context: Context | null;
    public readonly location: Location | null;

    public constructor(
        summary: Description,
        description: Description | null = null,
        tags: Tag[] = [],
        context: Context | null = null,
        location: Location | null = null,
    ) {
        this.summary = summary;
        this.description = description ?? new Description('');
        tags.forEach((tag) => this.addTag(tag));

        this.context = context;
        this.location = location;
    }

    public getTagsByName(name: string): Tag[] {
        return this.tags.filter((tag) => tag.getName() === name);
    }

    // public getTagsWithTypeByName(name: string): TagWithType[]

    public hasTag(name: string): boolean {
        return this.tags.some((tag) => tag.getName() === name);
    }

    // public removeTag(tagToRemove: BaseTag): void

    public addTag(tag: Tag): void {
        this.tags.push(tag);
    }
}
