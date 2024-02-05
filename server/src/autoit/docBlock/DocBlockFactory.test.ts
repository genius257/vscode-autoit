import parser, { MultiLineComment } from "autoit3-pegjs";
import DocBlockFactory from "./DocBlockFactory";

test('stripDocComment', () => {
    const s = `
    #cs
    # Summary.
    # Description
    # @see something
    #ce
    `;
    
    const ast = parser.parse(s);

    const comment = ast.body.find(((element): element is MultiLineComment => element.type === "MultiLineComment"));

    if (comment === undefined) {
        throw new Error('Error generating MultiLineComment AST element');
    }
    
    const factory = DocBlockFactory.createInstance();

    const expected = "Summary.\nDescription\n@see something";

    const actual = factory.stripDocComment(comment.body);

    expect(actual).toBe(expected);
});

test('createFromMultilineComment', () => {
    const s = `
    #cs
    # Summary.
    # Description
    # @see something
    #ce
    `;
    
    const ast = parser.parse(s);

    const comment = ast.body.find(((element): element is MultiLineComment => element.type === "MultiLineComment"));

    if (comment === undefined) {
        throw new Error('Error generating MultiLineComment AST element');
    }
    
    const factory = DocBlockFactory.createInstance();
    const x = factory.createFromMultilineComment(comment);
    expect(x.summary).toBe('Summary.');
    expect(x.description.toString()).toBe('Description');
    expect(x.tags).toHaveLength(1);
    expect(x.tags[0].render()).toBe('@see something');
});
