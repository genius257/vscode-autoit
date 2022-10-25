import * as FileAstMap from "./FileAstMap";
import parser from "autoit3-pegjs";

const fileAstMap = new FileAstMap.default(null);

test("getIdentifierAt", function () {
    fileAstMap.add("test", parser.parse("$x = 1"));
    
    const identifier = fileAstMap.getIdentifierAt("test", 1, 1);

    expect(identifier).not.toBeNull();
});

test("getIdentifierAt nested", function () {
    fileAstMap.add("test", parser.parse("Const $x = 1\nConst $y = $x"));
    
    const identifier = fileAstMap.getIdentifierAt("test", 2, 12);

    expect(identifier).not.toBeNull();
});
