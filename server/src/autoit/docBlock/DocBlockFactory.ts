import type { Location, AutoIt3 } from 'autoit3-pegjs';
import DocBlock from './DocBlock';
import DescriptionFactory from './DocBlock/DescriptionFactory';
import Tag, { TagLike } from './DocBlock/Tag';
import TagFactory from './DocBlock/TagFactory';
import StandardTagFactory from './DocBlock/StandardTagFactory';
import Factory from './DocBlock/Tags/Factory/Factory';
import FqsenResolver from './FqsenResolver';
import TypeResolver from './TypeResolver';
import Context from './Types/Context';

export default class DocBlockFactory {
    private descriptionFactory: DescriptionFactory;
    private tagFactory: TagFactory;

    public constructor(
        descriptionFactory: DescriptionFactory,
        tagFactory: TagFactory,
    ) {
        this.descriptionFactory = descriptionFactory;
        this.tagFactory = tagFactory;
    }

    public static createInstance(
        additionalTags: Record<string, TagLike | TagFactory> = {},
    ): DocBlockFactory {
        const fqsenResolver = new FqsenResolver();
        const tagFactory = new StandardTagFactory(fqsenResolver);
        const descriptionFactory = new DescriptionFactory(tagFactory);
        const typeResolver = new TypeResolver(fqsenResolver);

        /*
         * // FIXME
         *const au3stanTagFactory = new AbstractAU3StanFactory(
         *    new ParamFactory(typeResolver, descriptionFactory),
         *    new VarFactory(typeResolver, descriptionFactory),
         *    new ReturnFactory(typeResolver, descriptionFactory),
         *    new PropertyFactory(typeResolver, descriptionFactory),
         *    new PropertyReadFactory(typeResolver, descriptionFactory),
         *    new PropertyWriteFactory(typeResolver, descriptionFactory),
         *    new MethodFactory(typeResolver, descriptionFactory)
         *);
         */

        tagFactory.addService(descriptionFactory);
        tagFactory.addService(typeResolver);

        /*
         * // FIXME
         *tagFactory.registerTagHandler('param', au3stanTagFactory);
         *tagFactory.registerTagHandler('var', au3stanTagFactory);
         *tagFactory.registerTagHandler('return', au3stanTagFactory);
         *tagFactory.registerTagHandler('property', au3stanTagFactory);
         *tagFactory.registerTagHandler('property-read', au3stanTagFactory);
         *tagFactory.registerTagHandler('property-write', au3stanTagFactory);
         *tagFactory.registerTagHandler('method', au3stanTagFactory);
         */

        const docBlockFactory = new this(descriptionFactory, tagFactory);

        Object.entries(additionalTags).forEach(
            ([
                tagName,
                tagHandler,
            ]) => docBlockFactory.registerTagHandler(
                tagName,
                tagHandler,
            ),
        );

        return docBlockFactory;
    }

    public createFromLegacyComments(
        comments: AutoIt3.SingleLineComment[],
    ): DocBlock | null {
        /*
         * TODO: move this to a legacy factory class maybe?
         *  Extract relevant information and convert legacy function documentaion header to DocBlock
         */

        const docBlock = comments.map((comment) => comment.body).join('\n');

        if (!/^[ \t]* #\w+# =*\n([ \t]* \w+[ \t]?\.*:([^\n]*\n([ \t]*(?!\w+[ \t]?\.*:).*\n)*|\n))*[ \t]* =*$/.test(docBlock)) {
            return null;
        }

        const docBlockItems = [...docBlock.matchAll(/^[ \t]* ([\w ]+)[ \t]?\.*:([^\n]*\n(?:(?![ \t]*[\w ]+[ \t]?\.*:|[ \t]*=+[ \t]*$)[^\n]*\n)*)/gm)];

        if (docBlockItems.length === 0) {
            throw new Error('Failed to split UDF header elements! RegEx failed!');
        }

        const dockBlockdata: Record<string, string> = (docBlockItems as (RegExpExecArray & { '1': string, '2': string })[]).reduce(
            (result, item) => {
                result[item[1].trim().toLowerCase()] = item[2].trim();

                return result;
            },
            {},
        );

        const summary = dockBlockdata['description'] ?? '';
        const description = dockBlockdata['remarks'] ?? '';

        if (summary === '' && description === '') {
            return null;
        }

        if (description === '') {
            return this.create(`# ${summary}`);
        }

        return this.create(
            `
# ${summary}
#
# ${description}
`,
        );
    }

    public createFromMultilineComment(
        comment: AutoIt3.MultiLineComment,
    ): DocBlock {
        return this.create(comment.body);
    }

    public create(
        docblock: string,
        context: Context | null = null,
        location: Location | null = null,
    ) {
        if (context === null) {
            context = new Context('');
        }

        const [
            summary,
            description,
            tags,
        ] = this.splitDocBlock(
            this.stripDocComment(docblock),
        );

        return new DocBlock(
            this.descriptionFactory.create(summary),
            description
                ? this.descriptionFactory.create(description, context)
                : null,
            this.parseTagBlock(tags, context),
            null, // context,
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
            .replace(/(\r\n|\r)/g, '\n');
    }

    public splitDocBlock(
        comment: string,
    ): [summary: string, description: string, tags: string] {
        // Performance: If the first character is an @ then only tags are included in this DocBlock.
        if (comment[0] === '@') {
            return [
                '',
                '',
                comment,
            ];
        }

        // clears all extra horizontal whitespace from the line endings to prevent parsing issues
        comment = comment.replace(/[ \t]*$/um, '');

        const results = comment.match(/^(?:(?!@\p{Letter})([^\n.]+(?:(?!\.\n|\n{2})[\n.]*(?![ \t]*@\p{Letter})[^\n.]+)*\.?)?)(?:\s*(?!@\p{Letter})([^\n]+(?:\n+(?![ \t]*@\p{Letter})[^\n]+)*))?(\s+[\s\S]*)?/u);

        if (results === null) {
            throw new Error('Failed to split DocBlock elements! RegEx failed!');
        }

        return [
            results[1] ?? '',
            results[2] ?? '',
            results[3] ?? '',
        ];
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
        tags.split('\n').forEach((tagLine: string) => {
            if (tagLine !== '' && tagLine.indexOf('@') === 0) {
                result.push(tagLine);
            } else {
                result[result.length - 1] += '\n' + tagLine;
            }
        });

        return result;
    }

    public registerTagHandler(tagName: string, handler: TagLike | Factory) {
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
