import { expect, test, describe } from 'vitest';
import { URI } from 'vscode-uri';
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

    test('getNodesAt on member expression with call expression object', function () {
        const script = new Script(`$obj.Method().Property`);

        // Position inside $obj (the object subtree, outside the MemberExpression's own location)
        const result = script.getNodesAt({ character: 1, line: 0 });

        /*
         * With the guard: ExpressionStatement, outer MemberExpression, CallExpression,
         *   inner MemberExpression, VariableIdentifier = 5 nodes
         * Without the guard: outer MemberExpression would be skipped → only 4 nodes
         */
        expect(result).toHaveLength(5);
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

        const functionScope = functionScopes[0];

        expect(functionScope?.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Global $x in function declares in global scope', function () {
        const script = new Script(`Func test()
    Global $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);

        const functionScope = functionScopes[0];

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
        expect(functionScope?.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Dim $x in function without existing global declares in function scope', function () {
        const script = new Script(`Func test()
    Dim $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);

        const functionScope = functionScopes[0];

        expect(functionScope?.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
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

        const functionScope = functionScopes[0];

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(2);
        expect(functionScope?.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Dim $x at global scope declares in global scope', function () {
        const script = new Script(`Dim $x`);
        const globalScope = script.getScope();

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
    });
});

describe('Synthetic nodes for special symbol references', function () {
    test('getNodesAt on IsDeclared with string literal produces SyntheticVariableIdentifier', function () {
        const script = new Script(`IsDeclared('varName')`);

        // Position inside the string literal argument 'varName'
        const result = script.getNodesAt({ character: 14, line: 0 });

        const syntheticNode = result.find((node) => node.type === 'SyntheticVariableIdentifier');
        expect(syntheticNode).toBeDefined();
        expect(syntheticNode?.type).toBe('SyntheticVariableIdentifier');
        expect((syntheticNode as { name: string }).name).toBe('varName');
    });

    test('getNodesAt on IsDeclared with $-prefixed string literal strips $ prefix', function () {
        const script = new Script(`IsDeclared('$varName')`);

        // Position inside the string literal argument '$varName'
        const result = script.getNodesAt({ character: 15, line: 0 });

        const syntheticNode = result.find((node) => node.type === 'SyntheticVariableIdentifier');
        expect(syntheticNode).toBeDefined();
        expect(syntheticNode?.type).toBe('SyntheticVariableIdentifier');
        expect((syntheticNode as { name: string }).name).toBe('varName');
    });

    test('IsDeclared adds variable reference to scope', function () {
        const script = new Script(`Global $myVar
IsDeclared('myVar')`);
        const globalScope = script.getScope();

        const symbol = globalScope.getSymbol('$myvar' as SymbolKey);
        expect(symbol).toBeDefined();

        // The symbol should have references including the SyntheticVariableIdentifier from IsDeclared
        const refNodes = [...symbol?.getReferences() ?? []];
        const syntheticRef = refNodes.find((node) => node.type === 'SyntheticVariableIdentifier');
        expect(syntheticRef).toBeDefined();
        expect((syntheticRef as { name: string }).name).toBe('myVar');
    });

    test('getNodesAt on Eval with string literal produces SyntheticVariableIdentifier', function () {
        const script = new Script(`Eval('varName')`);

        // Position inside the string literal argument 'varName'
        const result = script.getNodesAt({ character: 9, line: 0 });

        const syntheticNode = result.find((node) => node.type === 'SyntheticVariableIdentifier');
        expect(syntheticNode).toBeDefined();
        expect(syntheticNode?.type).toBe('SyntheticVariableIdentifier');
        expect((syntheticNode as { name: string }).name).toBe('varName');
    });

    test('getNodesAt within Execute() string finds parsed nodes at document positions', function () {
        const script = new Script(`Global $abc = 123
Execute('$abc')`);

        // Position inside $abc within the Execute string (line 2, column 10, 1-based)
        const result = script.getNodesAt({ line: 1, character: 10 });

        const variableNode = result.find((node) => node.type === 'VariableIdentifier');
        expect(variableNode).toBeDefined();
        expect((variableNode as { location: { start: { line: number, column: number } } }).location.start.line).toBe(2);
        expect((variableNode as { location: { start: { line: number, column: number } } }).location.start.column).toBe(10);
    });

    test('getNodesAt within Execute() string produces synthetic nodes from the parsed content', function () {
        const script = new Script(`Global $abc = 123
Execute("IsDeclared('abc')")`);

        // Position inside 'abc' within the nested IsDeclared call in the Execute string
        const result = script.getNodesAt({ line: 1, character: 21 });

        const syntheticNode = result.find((node) => node.type === 'SyntheticVariableIdentifier');
        expect(syntheticNode).toBeDefined();
        expect((syntheticNode as { name: string }).name).toBe('abc');
    });

    test('getNodesAt on Call with string literal produces SyntheticIdentifier', function () {
        const script = new Script(`Call('funcName')`);

        // Position inside the string literal argument 'funcName'
        const result = script.getNodesAt({ character: 10, line: 0 });

        const syntheticNode = result.find((node) => node.type === 'SyntheticIdentifier');
        expect(syntheticNode).toBeDefined();
        expect(syntheticNode?.type).toBe('SyntheticIdentifier');
        expect((syntheticNode as { name: string }).name).toBe('funcName');
    });

    test('getNodesAt on IsDeclared outside argument does not produce synthetic node', function () {
        const script = new Script(`IsDeclared('varName')`);

        // Position on "IsDeclared" identifier, not inside the string literal
        const result = script.getNodesAt({ character: 2, line: 0 });

        const syntheticNode = result.find((node) => node.type === 'SyntheticVariableIdentifier');
        expect(syntheticNode).toBeUndefined();
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

        const functionScope = functionScopes[0];

        expect(functionScope?.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Global Enum $x in function declares in global scope', function () {
        const script = new Script(`Func test()
    Global Enum $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);

        const functionScope = functionScopes[0];

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
        expect(functionScope?.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Dim Enum $x in function without existing global declares in function scope', function () {
        const script = new Script(`Func test()
    Dim Enum $x
EndFunc`);
        const globalScope = script.getScope();
        const functionScopes = [...globalScope.getSubscopes()];
        expect(functionScopes).toHaveLength(1);

        const functionScope = functionScopes[0];

        expect(functionScope?.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
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

        const functionScope = functionScopes[0];

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(2);
        expect(functionScope?.getSymbol('$x' as SymbolKey)?.getDeclarations().size ?? 0).toBe(0);
    });

    test('Enum $x at global scope declares in global scope', function () {
        const script = new Script(`Enum $x`);
        const globalScope = script.getScope();

        expect(globalScope.getSymbol('$x' as SymbolKey)?.getDeclarations().size).toBe(1);
    });
});

describe('References location source', function () {
    function findReferencesWithMissingSource(script: Script): unknown[] {
        const bad: unknown[] = [];
        const scope = script.getScope();

        type ScopeLike = {
            getSymbols(): Map<string, { getReferences(): Set<{ type: string, location: { source?: unknown } }> }>,
            getSubscopes(): unknown[],
        };

        const walk = (s: ScopeLike, depth: number): void => {
            if (depth > 10) {
                return;
            }

            for (const [, symbol] of s.getSymbols().entries()) {
                for (const reference of symbol.getReferences()) {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (reference.location?.source === undefined) {
                        bad.push(reference);
                    }
                }
            }

            for (const subscope of s.getSubscopes()) {
                walk(subscope as ScopeLike, depth + 1);
            }
        };

        walk(scope as unknown as ScopeLike, 0);

        return bad;
    }

    test('Execute() string references map to document positions', function () {
        const script = new Script(`Global $abc = 123
Execute('$abc')`, URI.file('/exec2.au3'));

        type ReferenceNode = { location: { start: { line: number, column: number } } };
        type ScopeLike = {
            getSymbols(): Map<string, { getReferences(): Set<ReferenceNode> }>,
            getSubscopes(): unknown[],
        };

        const walk = (s: ScopeLike, depth: number): ReferenceNode[] => {
            if (depth > 10) {
                return [];
            }

            return [
                ...[...s.getSymbols().values()].flatMap((symbol) => [...symbol.getReferences()]),
                ...[...s.getSubscopes() as Iterable<ScopeLike>].flatMap((subscope) => walk(subscope, depth + 1)),
            ];
        };

        const inString = walk(script.getScope() as unknown as ScopeLike, 0)
            .find((r) => r.location.start.line === 2 && r.location.start.column === 10);

        expect(inString).toBeDefined(); // $abc inside the Execute string
    });

    test('references from Execute() strings keep the document source', function () {
        const script = new Script(`Global $abc = 123
Execute('$abc')
$abc`, URI.file('/execute.au3'));

        expect(findReferencesWithMissingSource(script)).toEqual([]);
    });

    test('all references have a location source on a mixed document', function () {
        const script = new Script(`Global $abc = 123

Func x($a)
    Local $abc
    $abc
    IsDeclared('abc')
EndFunc

x()
$abc
Call('x')
Eval('abc')
Assign('abc', '', "a")
Execute('$abc')`, URI.file('/mixed.au3'));

        expect(findReferencesWithMissingSource(script)).toEqual([]);
    });
});

describe('Batched updates', function () {
    test('updateAll applies a batch of changes as a single revision', function () {
        const script = new Script('Local $a = 1\nLocal $b = 2', URI.file('/batch.au3'));
        const revisionBefore = script.getRevision();

        script.updateAll([
            { range: { start: { line: 0, character: 12 }, end: { line: 0, character: 12 } }, text: '23' },
            { range: { start: { line: 1, character: 0 }, end: { line: 1, character: 0 } }, text: 'Local $c = 3\n' },
        ]);

        expect(script.getRevision()).toBe(revisionBefore + 1);
        expect(script.getText()).toBe('Local $a = 123\nLocal $c = 3\nLocal $b = 2');

        const third = script.getProgram()?.body[1];

        if (third?.type !== 'VariableDeclaration') {
            throw new Error('Expected a VariableDeclaration');
        }

        expect(third.location.start.line).toBe(2);
    });

    test('updateAll with no changes is a no-op', function () {
        const script = new Script('Local $a = 1', URI.file('/batch-empty.au3'));
        const revisionBefore = script.getRevision();

        script.updateAll([]);

        expect(script.getRevision()).toBe(revisionBefore);
        expect(script.getText()).toBe('Local $a = 1');
    });
});
