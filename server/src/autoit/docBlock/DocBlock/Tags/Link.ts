import Description from '../Description';
import DescriptionFactory from '../DescriptionFactory';
import BaseTag from './BaseTag';
import TypeContext from '../../Types/Context';
import StandardTagFactory from '../StandardTagFactory';
import FqsenResolver from '../../FqsenResolver';

export default class Link extends BaseTag {
    protected override name: string = 'link';

    private link: string;

    public constructor(link: string, description: Description | null = null) {
        super();
        this.link = link;
        this.description = description;
    }

    public static override create(
        body: string,
        descriptionFactory: DescriptionFactory | null = null,
        context: TypeContext | null = null,
    ): Link | null {
        descriptionFactory ??= new DescriptionFactory(
            new StandardTagFactory(new FqsenResolver())
        ); // Qick fix, since the current codebase diviates from the original PHPDoc codebase.

        const parts = body.split(/\s+(.*)/u, 2); // Trick to match PHP preg_match with a limit of 2 https://stackoverflow.com/a/4607799 https://github.com/phpDocumentor/ReflectionDocBlock/blob/e5e784149a09bd69d9a5e3b01c5cbd2e2bd653d8/src/DocBlock/Tags/Link.php#L47
        const description =
            parts.length > 1
                ? descriptionFactory?.create(parts[1]!, context)
                : null;

        if (parts[0] === undefined) {
            return null; // source always assumes index 0 is available, added this for typesafety: https://github.com/phpDocumentor/ReflectionDocBlock/blob/29e383a759d575c66317e5229284dd0b8aca7e53/src/DocBlock/Tags/Link.php#L42-L53
        }

        return new this(parts[0], description);
    }

    public getLink(): string {
        return this.link;
    }

    public toString(): string {
        const description =
            this.description !== null ? this.description.render() : '';

        const link = this.link;

        return `${link}${
            description !== '' ? (link !== '' ? ' ' : '') + description : ''
        }`;
    }
}
