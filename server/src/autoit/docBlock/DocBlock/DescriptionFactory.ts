import Description from "./Description";
import Factory from "./Tags/Factory/Factory";
import TypeContext from "../Types/Context";
import Tag from "./Tag";

export default class DescriptionFactory {
    private tagFactory: Factory;
    
    public constructor(tagFactory: Factory) {
        this.tagFactory = tagFactory;
    }

    public create(contents: string, context: TypeContext|null = null): Description {
        const tokens = this.lex(contents);
        const count = tokens.length;
        let tagCount = 0;
        const tags: Tag[] = [];

        for (let index = 1; index < count; index+=2) {
            tags.push(this.tagFactory.create(tokens[index]!, context));
            tokens[index] = `%${++tagCount}$s`;
        }

        //In order to allow "literal" inline tags, the otherwise invalid
        //sequence "{@}" is changed to "@", and "{}" is changed to "}".
        //"%" is escaped to "%%" because of vsprintf.
        //See unit tests for examples.
        for (let index = 0; index < count; index+=2) {
            tokens[index] = tokens[index]!.replace(/{@}/g, '@').replace(/{}/g, '}').replace(/%/g, '%%');
        }


        return new Description(tokens.join(''), tags);
    }

    private lex(contents: string): string[] {
        contents = this.removeSuperfluousStartingWhitespace(contents);

        // performance optimalization; if there is no inline tag, don't bother splitting it up.
        if (!contents.includes('{@')) {
            return [contents];
        }

        //FIXME: implement: https://github.com/phpDocumentor/ReflectionDocBlock/blob/master/src/DocBlock/DescriptionFactory.php#L102
        return [contents];
    }

    private removeSuperfluousStartingWhitespace(contents: string): string {
        const lines = contents.split(/\r\n?|\n/g);

        // if there is only one line then we don't have lines with superfluous whitespace and
        // can use the contents as-is
        if (lines.length <= 1) {
            return contents;
        }

        // determine how many whitespace characters need to be stripped
        let startingSpaceCount = 9999999;
        for (let index = 1, iMax = lines.length; index < iMax; ++index) {
            // lines with a no length do not count as they are not indented at all
            if (lines[index]!.trim() === '') {
                continue;
            }

            // determine the number of prefixing spaces by checking the difference in line length before and after
            // an ltrim
            startingSpaceCount = Math.min(startingSpaceCount, lines[index]!.length - lines[index]!.trimStart().length);
        }

        // strip the number of spaces from each line
        if (startingSpaceCount > 0) {
            for (let index = 1, iMax = lines.length; index < iMax; ++index) {
                lines[index] = lines[index]!.substring(startingSpaceCount);
            }
        }

        return lines.join("\n");
    }
}
