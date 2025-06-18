import { expect, test } from 'vitest';
import parser, { type AutoIt3 } from 'autoit3-pegjs';
import DocBlockFactory from './DocBlockFactory';
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

    const comment: AutoIt3.MultiLineComment = ast.body.find((element): element is AutoIt3.MultiLineComment => element.type === 'MultiLineComment') as AutoIt3.MultiLineComment;

    if (comment === undefined) {
        throw new Error('Error generating MultiLineComment AST element');
    }

    const factory = DocBlockFactory.createInstance();

    const expected = 'Summary.\nDescription\n@see something';

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

    const comment: AutoIt3.MultiLineComment = ast.body.find((element): element is AutoIt3.MultiLineComment => element.type === 'MultiLineComment') as AutoIt3.MultiLineComment;

    if (comment === undefined) {
        throw new Error('Error generating MultiLineComment AST element');
    }

    const factory = DocBlockFactory.createInstance();
    const x = factory.createFromMultilineComment(comment);
    expect(x.summary.toString()).toBe('Summary.');
    expect(x.description.toString()).toBe('Description');
    expect(x.tags).toHaveLength(1);
    expect(x.tags[0]?.render()).toBe('@see something');
});

test('createFromLegacySingleLineComments', () => {
    const s = `; #FUNCTION# ====================================================================================================================
    ; Name...........: _WinAPI_GetMousePos
    ; Description ...: Returns the current mouse position
    ; Syntax.........: _WinAPI_GetMousePos([$bToClient = False[, $hWnd = 0]])
    ; Parameters ....: $bToClient   - If True, the coordinates will be converted to client coordinates
    ;                  $hWnd        - Window handle used to convert coordinates if $fToClient is True
    ; Return values .: Success      - $tagPOINT structure with current mouse position
    ;                  Failure      - 0
    ; Author ........: Paul Campbell (PaulIA)
    ; Modified.......:
    ; Remarks .......: This function takes into account the current MouseCoordMode setting when  obtaining  the  mouse  position.
    ;                  It will also convert screen to client coordinates based on the parameters passed.
    ; Related .......: $tagPOINT, _WinAPI_GetMousePosX, _WinAPI_GetMousePosY
    ; Link ..........: 
    ; Example .......: Yes
    ; ===============================================================================================================================`;

    const ast = parser.parse(s);

    const comment: AutoIt3.SingleLineComment[] = ast.body.filter((element): element is AutoIt3.SingleLineComment => element.type === 'SingleLineComment') as AutoIt3.SingleLineComment[];

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

// the empty newline in remaks content, caused catastrophic backtracking in the regex validating if the comment content matches expected format.
test('createFromLegacySingleLineComments edge-case#1', () => {
    const s = `; #FUNCTION# ====================================================================================================================
    ; Name ..........: _Acro_DocBookmarkProperties
    ; Description ...: Sets the various properties of a bookmark and returns an array of properties
    ; Syntax ........: _Acro_DocBookmarkProperties($oBookmark[, $sName = Default[, $aColor = Default[, $bOpen = Default[,
    ;                  $iStyle = Default[, $sExecutableJavaScript = Default]]]]])
    ; Parameters ....: $oBookmark           - an object.
    ;                  $sName               - [optional] a string value. Default is Default.
    ;                  $aColor              - [optional] an array, see remarks. Default is Default.
    ;                  $bOpen               - [optional] True - expended, False - collapsed. Default is Default.
    ;                  $iStyle              - [optional] an integer, see remarks. Default is Default.
    ;                  $sExecutableJavaScript- [optional] a string value. Default is Default.
    ; Return values .: Success - a 0-based 1D array of properties, see remarks for details
    ;                  Failure - False and sets @error:
    ;                  |1 - $oBookmark isn't an object
    ;                  |2 - Error setting name, sets @extended to COM error
    ;                  |3 - Error setting color, sets @extended to COM error
    ;                  |4 - Error setting open, sets @extended to COM error
    ;                  |5 - Error setting style, sets @extended to COM error
    ;                  |6 - Error setting action (JavaScript), sets @extended to COM error
    ; Author ........: Seadoggie01
    ; Modified ......: November 23, 2020
    ; Remarks .......: Use like: _Acro_DocBookmarkProperties($oBookmark) to get an array of values
    ;
    ;                  Default means values won't be changed.
    ;                  $aColor is ["T"] for transparent, ["G", x] for grayscale,
    ;                  +["RGB", x, x, x] for a RGB value, or ["CMYK", x, x, x, x] for a CMYK value.
    ;                  +N.B. The JavaScript color object isn't available through the COM.
    ;                  $iStyle: 0 is normal, 1 is italic, 2 is bold, and 3 is bold-italic
    ;                  $sExecutableJavaScript is NOT checked for valid JavaScript
    ; Related .......:
    ; Link ..........:
    ; Example .......: No
    ; ===============================================================================================================================`;

    const ast = parser.parse(s);

    const comment: AutoIt3.SingleLineComment[] = ast.body.filter((element): element is AutoIt3.SingleLineComment => element.type === 'SingleLineComment') as AutoIt3.SingleLineComment[];

    if (comment.length === 0) {
        throw new Error('Error generating SingleLineComment AST elements');
    }

    const factory = DocBlockFactory.createInstance();
    const x = factory.createFromLegacyComments(comment);
    expect(x).not.toBeNull();
    expect(x?.summary.toString()).toBe('Sets the various properties of a bookmark and returns an array of properties');
    expect(x?.description.toString()).toBe(`Use like: _Acro_DocBookmarkProperties($oBookmark) to get an array of values

Default means values won't be changed.
$aColor is ["T"] for transparent, ["G", x] for grayscale,
+["RGB", x, x, x] for a RGB value, or ["CMYK", x, x, x, x] for a CMYK value.
+N.B. The JavaScript color object isn't available through the COM.
$iStyle: 0 is normal, 1 is italic, 2 is bold, and 3 is bold-italic
$sExecutableJavaScript is NOT checked for valid JavaScript`);
    expect(x?.tags).toHaveLength(0);
});

test('author tag', () => {
    const s = `
    #cs
    # @author paul
    #ce
    `;

    const ast = parser.parse(s);

    const comment: AutoIt3.MultiLineComment = ast.body.find((element): element is AutoIt3.MultiLineComment => element.type === 'MultiLineComment') as AutoIt3.MultiLineComment;

    if (comment === undefined) {
        throw new Error('Error generating MultiLineComment AST element');
    }

    const factory = DocBlockFactory.createInstance();
    const x = factory.createFromMultilineComment(comment);
    expect(x.summary.toString()).toBe('');
    expect(x.description.toString()).toBe('');
    expect(x.tags).toHaveLength(1);
    expect(x.tags[0]).instanceOf(Author);
    expect(x.tags[0]?.render()).toBe('@author paul');
});

test('not supported tag', () => {
    const s = `
    #cs
    # @foo paul
    #ce
    `;

    const ast = parser.parse(s);

    const comment: AutoIt3.MultiLineComment = ast.body.find((element): element is AutoIt3.MultiLineComment => element.type === 'MultiLineComment') as AutoIt3.MultiLineComment;

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

    const comment: AutoIt3.MultiLineComment = ast.body.find((element): element is AutoIt3.MultiLineComment => element.type === 'MultiLineComment') as AutoIt3.MultiLineComment;

    if (comment === undefined) {
        throw new Error('Error generating MultiLineComment AST element');
    }

    const fqsenResolver = new FqsenResolver();
    const tagFactory = new StandardTagFactory(fqsenResolver);
    const descriptionFactory = new MarkdownDescriptionFactory(tagFactory);
    const factory = new DocBlockFactory(descriptionFactory, tagFactory);

    // const factory = DocBlockFactory.createInstance();
    const x = factory.createFromMultilineComment(comment);
    expect(x.summary.toString()).toBe('Summary <https://www.example.com>.');
    expect(x.description.render()).toBe('Description <https://www.example.com>.\nNext line [link text](https://www.example.com).');
    expect(x.description.toString()).toBe('Description <https://www.example.com>.\nNext line [link text](https://www.example.com).');
});
