import { expect, test, describe } from 'vitest';
import Script from './Script';
import type { SymbolKey } from './Scope';

describe('Script', function () {
    const script = new Script(`If 1 Then
    Exit 1
EndIf`);

    test('getNodesAt', function () {
        expect(script.getNodesAt({ character: 1, line: 0 }).reverse()[0]?.type).toBe('IfStatement');
        expect(script.getNodesAt({ character: 6, line: 1 }).reverse()[0]?.type).toBe('ExitStatement');
        expect(script.getNodesAt({ character: 3, line: 2 }).reverse()[0]?.type).toBe('IfStatement');
    });
});

describe('getNodesAt nested call expressions', function () {
    test('getNodesAt on standard call expression', function () {
        const script = new Script(`InetGet('http://www.google.com/')`);

        const result = script.getNodesAt({ character: 1, line: 0 });

        expect(result).toHaveLength(3);
    });

    test('getNodesAt on nested call expressions', function () {
        const script = new Script(`InetGet('http://www.google.com/')()`);

        const result = script.getNodesAt({ character: 1, line: 0 });

        expect(result).toHaveLength(4);
    });
});

describe('VariableDeclaration scope handling', function () {
    test('Local $x in function declares in function scope', function () {
        const script = new Script(`Func test()
    Local $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);
        const functionScope = functionScopes[0]!;

        expect(functionScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Global $x in function declares in global scope', function () {
        const script = new Script(`Func test()
    Global $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);
        const functionScope = functionScopes[0]!;

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
        expect(functionScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Dim $x in function without existing global declares in function scope', function () {
        const script = new Script(`Func test()
    Dim $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);
        const functionScope = functionScopes[0]!;

        expect(functionScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Dim $x in function with existing global declares in global scope', function () {
        const script = new Script(`Global $x
Func test()
    Dim $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);
        const functionScope = functionScopes[0]!;

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(2);
        expect(functionScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Dim $x at global scope declares in global scope', function () {
        const script = new Script(`Dim $x`);
        const globalScope = script.getScope();

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
    });
});

describe('EnumDeclaration scope handling', function () {
    test('Local Enum $x in function declares in function scope', function () {
        const script = new Script(`Func test()
    Local Enum $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);
        const functionScope = functionScopes[0]!;

        expect(functionScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Global Enum $x in function declares in global scope', function () {
        const script = new Script(`Func test()
    Global Enum $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);
        const functionScope = functionScopes[0]!;

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
        expect(functionScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Dim Enum $x in function without existing global declares in function scope', function () {
        const script = new Script(`Func test()
    Dim Enum $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);
        const functionScope = functionScopes[0]!;

        expect(functionScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Dim Enum $x in function with existing global declares in global scope', function () {
        const script = new Script(`Global Enum $x
Func test()
    Dim Enum $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);
        const functionScope = functionScopes[0]!;

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(2);
        expect(functionScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Enum $x at global scope declares in global scope', function () {
        const script = new Script(`Enum $x`);
        const globalScope = script.getScope();

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
    });
});
