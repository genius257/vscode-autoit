import { expect, test, describe } from 'vitest'
import Script from "./Script";

describe("Script", function () {
    const script = new Script(`If 1 Then
    Exit 1
EndIf`);

    test("getNodesAt", function() {
        expect(script.getNodesAt({character: 1, line: 0}).reverse()[0]!.type).toBe("IfStatement");
        expect(script.getNodesAt({character: 6, line: 1}).reverse()[0]!.type).toBe("ExitStatement");
        expect(script.getNodesAt({character: 3, line: 2}).reverse()[0]!.type).toBe("IfStatement");
    });
});