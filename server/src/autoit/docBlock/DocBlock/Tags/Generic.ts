import Description from "../Description";
import BaseTag from "./BaseTag";
import DescriptionFactory from "../DescriptionFactory";
import TypeContext from "../../Types/Context";
import StandardTagFactory from "../StandardTagFactory";
import FqsenResolver from "../../FqsenResolver";

//FIXME: cannot currently do implements Factory\StaticMethod, due to it caintaining only a public static method, and i already extend another class (and i ain't gonna create a extends hack for this for now.)
export default class Generic extends BaseTag {
    public constructor(name: string, description: Description|null = null) {
        super();

        this.validateTagName(name);

        this.name = name;
        this.description = description;
    }

    public static override create(body: string, name: string = '', descriptionFactory: DescriptionFactory|null = null, context: TypeContext|null = null): Generic {
        descriptionFactory ??= new DescriptionFactory(new StandardTagFactory(new FqsenResolver()));// Qick fix, since the current codebase diviates from the original PHPDoc codebase.
        const description = body !== '' ? descriptionFactory?.create(body, context) : null;

        return new Generic(name, description);
    }

    public toString(): string {
        let description = '';
        if (this.description !== null) {
            description = this.description.render();
        }

        return description;
    }

    private validateTagName(name: string): void {
        if (!(new RegExp(`^${StandardTagFactory.REGEX_TAGNAME}$`, 'u')).test(name)) {
            throw new Error(`The tag name "${name}" is not wellformed. Tags may only consist of letters, underscores, hyphens and backslashes.`);
        }
    }
}
