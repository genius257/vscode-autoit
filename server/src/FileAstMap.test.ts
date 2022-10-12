import * as FileAstMap from "./FileAstMap";
import parser from "autoit3-pegjs";

const fileAstMap = new FileAstMap.default();

test("getIdentifierAt", function () {
    fileAstMap.add("test", parser.parse("$x = 1"));
    
    const identifier = fileAstMap.getIdentifierAt("test", 1, 1);
    
    expect(identifier).not.toBeNull();
});
