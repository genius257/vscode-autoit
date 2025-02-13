import { expect, test } from 'vitest'
import parser, { type AutoIt3 } from "autoit3-pegjs";
import DocBlockFactory from "./DocBlockFactory";
import Author from './DocBlock/Tags/Author';
import Generic from './DocBlock/Tags/Generic';
import FqsenResolver from './FqsenResolver';
import StandardTagFactory from './DocBlock/StandardTagFactory';
import MarkdownDescriptionFactory from './DocBlock/MarkdownDescriptionFactory';

test('stripDocComment', () => {
    const s = `
    #cs
    # Summary.
    # Description
    # @see something
    #ce
    `;
    
    const ast = parser.parse(s);

    const comment: AutoIt3.MultiLineComment = ast.body.find(((element): element is AutoIt3.MultiLineComment => element.type === "MultiLineComment")) as AutoIt3.MultiLineComment;

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

    const comment: AutoIt3.MultiLineComment = ast.body.find(((element): element is AutoIt3.MultiLineComment => element.type === "MultiLineComment")) as AutoIt3.MultiLineComment;

    if (comment === undefined) {
        throw new Error('Error generating MultiLineComment AST element');
    }
    
    const factory = DocBlockFactory.createInstance();
    const x = factory.createFromMultilineComment(comment);
    expect(x.summary.toString()).toBe('Summary.');
    expect(x.description.toString()).toBe('Description');
    expect(x.tags).toHaveLength(1);
    expect(x.tags[0]!.render()).toBe('@see something');
});

test('createFromLegacySingleLineComments', () => {
    const s = `; #FUNCTION# ====================================================================================================================
    ; Name...........: _WinAPI_GetMousePos
    ; Description ...: Returns the current mouse position
    ; Syntax.........: _WinAPI_GetMousePos([\$bToClient = False[, \$hWnd = 0]])
    ; Parameters ....: \$bToClient   - If True, the coordinates will be converted to client coordinates
    ;                  \$hWnd        - Window handle used to convert coordinates if \$fToClient is True
    ; Return values .: Success      - \$tagPOINT structure with current mouse position
    ;                  Failure      - 0
    ; Author ........: Paul Campbell (PaulIA)
    ; Modified.......:
    ; Remarks .......: This function takes into account the current MouseCoordMode setting when  obtaining  the  mouse  position.
    ;                  It will also convert screen to client coordinates based on the parameters passed.
    ; Related .......: \$tagPOINT, _WinAPI_GetMousePosX, _WinAPI_GetMousePosY
    ; Link ..........: 
    ; Example .......: Yes
    ; ===============================================================================================================================`;

    const ast = parser.parse(s);

    const comment: Array<AutoIt3.SingleLineComment> = ast.body.filter(((element): element is AutoIt3.SingleLineComment => element.type === "SingleLineComment")) as Array<AutoIt3.SingleLineComment>;

    if (comment.length === 0) {
        throw new Error('Error generating SingleLineComment AST elements');
    }

    const factory = DocBlockFactory.createInstance();
    const x = factory.createFromLegacyComments(comment);
    expect(x).not.toBeNull();
    expect(x?.summary.toString()).toBe('Returns the current mouse position');
    expect(x?.description.toString()).toBe('This function takes into account the current MouseCoordMode setting when  obtaining  the  mouse  position.\nIt will also convert screen to client coordinates based on the parameters passed.');
    expect(x?.tags).toHaveLength(0);
});

test('author tag', () => {
    const s = `
    #cs
    # @author paul
    #ce
    `;

    const ast = parser.parse(s);

    const comment: AutoIt3.MultiLineComment = ast.body.find(((element): element is AutoIt3.MultiLineComment => element.type === "MultiLineComment")) as AutoIt3.MultiLineComment;

    if (comment === undefined) {
        throw new Error('Error generating MultiLineComment AST element');
    }
    
    const factory = DocBlockFactory.createInstance();
    const x = factory.createFromMultilineComment(comment);
    expect(x.summary.toString()).toBe('');
    expect(x.description.toString()).toBe('');
    expect(x.tags).toHaveLength(1);
    expect(x.tags[0]).instanceOf(Author);
    expect(x.tags[0]!.render()).toBe('@author paul');
});

test('not supported tag', () => {
    const s = `
    #cs
    # @foo paul
    #ce
    `;

    const ast = parser.parse(s);

    const comment: AutoIt3.MultiLineComment = ast.body.find(((element): element is AutoIt3.MultiLineComment => element.type === "MultiLineComment")) as AutoIt3.MultiLineComment;

    if (comment === undefined) {
        throw new Error('Error generating MultiLineComment AST element');
    }
    
    const factory = DocBlockFactory.createInstance();
    const x = factory.createFromMultilineComment(comment);
    expect(x.summary.toString()).toBe('');
    expect(x.description.toString()).toBe('');
    expect(x.tags).toHaveLength(1);
    expect(x.tags[0]).instanceOf(Generic);
    expect(x.tags[0]?.getName()).toBe('foo');
});

test('inline tag', () => {
    const s = `
    #cs
    # Summary {@link https://www.example.com}.
    # Description {@link https://www.example.com}.
    # Next line {@link https://www.example.com link text}.
    # @link https://www.example.com
    #ce
    `;

    const ast = parser.parse(s);

    const comment: AutoIt3.MultiLineComment = ast.body.find(((element): element is AutoIt3.MultiLineComment => element.type === "MultiLineComment")) as AutoIt3.MultiLineComment;

    if (comment === undefined) {
        throw new Error('Error generating MultiLineComment AST element');
    }

    const fqsenResolver = new FqsenResolver();
    const tagFactory = new StandardTagFactory(fqsenResolver);
    const descriptionFactory = new MarkdownDescriptionFactory(tagFactory);
    const factory = new DocBlockFactory(descriptionFactory, tagFactory);

    //const factory = DocBlockFactory.createInstance();
    const x = factory.createFromMultilineComment(comment);
    expect(x.summary.toString()).toBe('Summary <https://www.example.com>.');
    expect(x.description.render()).toBe('Description <https://www.example.com>.\nNext line [link text](https://www.example.com).');
    expect(x.description.toString()).toBe('Description <https://www.example.com>.\nNext line [link text](https://www.example.com).');
});
