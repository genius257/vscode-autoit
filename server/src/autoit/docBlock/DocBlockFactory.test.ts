import parser, { MultiLineComment, SingleLineComment } from "autoit3-pegjs";
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

    const comment = ast.body.filter(((element): element is SingleLineComment => element.type === "SingleLineComment"));

    if (comment.length === 0) {
        throw new Error('Error generating SingleLineComment AST elements');
    }

    const factory = DocBlockFactory.createInstance();
    const x = factory.createFromLegacyComments(comment);
    expect(x).not.toBeNull();
    expect(x?.summary).toBe('Returns the current mouse position');
    expect(x?.description.toString()).toBe('This function takes into account the current MouseCoordMode setting when  obtaining  the  mouse  position.\nIt will also convert screen to client coordinates based on the parameters passed.');
    expect(x?.tags).toHaveLength(0);
});
