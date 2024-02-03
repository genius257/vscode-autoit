import type { Location, MultiLineComment } from "autoit3-pegjs";
import DocBlock from "./DocBlock";
import DescriptionFactory from "./DocBlock/DescriptionFactory";
import Tag from "./DocBlock/Tag";
import TagFactory from "./DocBlock/TagFactory";
import StandardTagFactory from "./DocBlock/StandardTagFactory";

export default class DocBlockFactory {
    private descriptionFactory: DescriptionFactory;
    private tagFactory: TagFactory;

    public constructor(descriptionFactory: DescriptionFactory, tagFactory: TagFactory) {
        this.descriptionFactory = descriptionFactory;
        this.tagFactory = tagFactory;
    }

    public static createInstance(additionalTags: Record<string, Tag|TagFactory> = {}): DocBlockFactory {
        const tagFactory = new StandardTagFactory(null);//FIXME: parameters here
        const descriptionFactory = new DescriptionFactory();

        const docBlockFactory = new this(descriptionFactory, tagFactory);

        Object.entries(additionalTags).forEach(([tagName, tagHandler]) => docBlockFactory.registerTagHandler(tagName, tagHandler));

        return docBlockFactory;
    }

    public createFromMultilineComment(comment: MultiLineComment) {
        return this.create(comment.body);
    }

    public create(docblock: string, context: Context|null = null, location: Location|null = null) {
        if (context === null) {
            context = new Context();
        }
        const [summary, description, tags] = this.splitDocBlock(this.stripDocComment(docblock));

        return new DocBlock(
            summary,
            description ? this.descriptionFactory.create(description, context) : null,
            this.parseTagBlock(tags, context),
            null, //context,
            location,
        );
    }

    /**
     * Strips the number-signs from the DocBlock comment
     */
    public stripDocComment(comment: string) {
        return comment
            .replace(/^[ \t]*#[ \t]*/gm, '')
            .trim()
            .replace(/(\r\n|\r)/g, "\n");
    }

    public splitDocBlock(comment: string): [summary: string, description: string, tags: string] {

        // Performance: If the first character is an @ then only tags are included in this DocBlock.
        if (comment[0] === '@') {
            return ['', '', comment];
        }

        // clears all extra horizontal whitespace from the line endings to prevent parsing issues
        comment = comment.replace(/[ \t]*$/um, '');

        const results = comment.match(/^(?:(?!@\p{Letter})([^\n.]+(?:(?!\.\n|\n{2})[\n.]*(?![ \t]*@\p{Letter})[^\n.]+)*\.?)?)(?:\s*(?!@\p{Letter})([^\n]+(?:\n+(?![ \t]*@\p{Letter})[^\n]+)*))?(\s+[\s\S]*)?/u);
        if (results === null) {
            throw new Error('Failed to split DocBlock elements! RegEx failed!');
        }

        return [results[1] ?? '', results[2] ?? '', results[3] ?? ''];
    }

    public parseTagBlock(tags: string, context: Context): Tag[] {
        const filteredTags = this.filterTagBlock(tags);
        if (filteredTags === null) {
            return [];
        }

        const result: Tag[] = [];

        const lines = this.splitTagBlockIntoTagLines(filteredTags);
        lines.forEach((tagLine, key) => {
            result[key] = this.tagFactory.create(tagLine.trim(), context);
        });

        return result;
    }

    public splitTagBlockIntoTagLines(tags: string): string[] {
        const result: string[] = [];
        tags.split("\n").forEach((tagLine: string) => {
            if (tagLine !== '' && tagLine.indexOf('@') === 0) {
                result.push(tagLine);
            } else {
                result[result.length - 1] += "\n" + tagLine;
            }
        });

        return result;
    }

    public registerTagHandler(tagName: string, handler: typeof Tag|Factory) {
        this.tagFactory.registerTagHandler(tagName, handler);
    }

    public filterTagBlock(tags: string) {
        tags = tags.trim();
        if (tags === '') {
            return null;
        }

        if (tags[0] !== '@') {
            // This only happens if there is an error with the parsing of the DocBlock that we didn't foresee.
            throw new Error('A tag block started with text instead of an at-sign(@): ' + tags);
        }

        return tags;
    }
}

class Context {
    //FIXME
}
