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

describe("getNodesAt nested call expressions", function () {
    test("getNodesAt on standard call expression", function() {
        const script = new Script(`InetGet('http://www.google.com/')`);

        const result = script.getNodesAt({character: 1, line: 0});

        expect(result).toHaveLength(3);
    });


    test("getNodesAt on nested call expressions", function() {
        const script = new Script(`InetGet('http://www.google.com/')()`);

        const result = script.getNodesAt({character: 1, line: 0});

        expect(result).toHaveLength(4);
    });
});
