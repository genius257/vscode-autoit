/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, test, describe } from 'vitest';
import parser from 'autoit3-pegjs';
import AstWrapper from './AstWrapper';
import { positionToOffset } from './PositionHelper';

/**
 * Asserts the incrementally built AST is indistinguishable from a fresh parse
 * of the wrapper's current text.
 */
function expectEquivalentToFreshParse(wrapper: AstWrapper): void {
    if (!wrapper.hasProgram()) {
        throw new Error('Expected an AST, but the document has syntax errors.');
    }

    expect(JSON.stringify(wrapper.getProgram())).toBe(JSON.stringify(parser.parse(wrapper.getText())));
}

class ZeroRegionLimitWrapper extends AstWrapper {
    protected override readonly regionSizeLimitRatio = 0;
}

describe('AstWrapper construction', function () {
    test('parses the initial text into a program', function () {
        const wrapper = new AstWrapper('MsgBox(0, \'\', \'Hello\')');

        expect(wrapper.getProgram().type).toBe('Program');
    });

    test('exposes the initial text', function () {
        const wrapper = new AstWrapper('MsgBox(0, \'\', \'Hello\')');

        expect(wrapper.getText()).toBe('MsgBox(0, \'\', \'Hello\')');
    });

    test('getText with a location slices the source text', function () {
        const wrapper = new AstWrapper('MsgBox(1)');
        const statement = wrapper.getProgram().body[0];

        if (statement?.type !== 'ExpressionStatement') {
            throw new Error('Expected an ExpressionStatement');
        }

        expect(wrapper.getText(statement.location)).toBe('MsgBox(1)');
    });
});

describe('AstWrapper full-text updates', function () {
    test('replaces the entire text and re-parses', function () {
        const wrapper = new AstWrapper('MsgBox(0, \'\', \'Hello\')');

        wrapper.update('Local $x = 1');

        expect(wrapper.getText()).toBe('Local $x = 1');
        expect(wrapper.getProgram().body[0]?.type).toBe('VariableDeclaration');
    });

    test('multiple full-text updates replace the previous text', function () {
        const wrapper = new AstWrapper('MsgBox(1)');

        wrapper.update('MsgBox(2)');
        wrapper.update('MsgBox(3)');

        expect(wrapper.getText()).toBe('MsgBox(3)');
    });
});

describe('AstWrapper incremental updates (expected behavior)', function () {
    test('applies a range change to the text', function () {
        const wrapper = new AstWrapper('MsgBox(0, \'\', \'Hello\')');

        wrapper.update({
            range: { start: { line: 0, character: 15 }, end: { line: 0, character: 20 } },
            text: 'World',
        });

        expect(wrapper.getText()).toBe('MsgBox(0, \'\', \'World\')');
    });

    test('reparses the affected branch after an incremental change', function () {
        const wrapper = new AstWrapper('MsgBox(0, \'\', \'Hello\')');

        wrapper.update({
            range: { start: { line: 0, character: 15 }, end: { line: 0, character: 20 } },
            text: 'World',
        });

        const statement = wrapper.getProgram().body[0];

        if (statement?.type !== 'ExpressionStatement') {
            throw new Error('Expected an ExpressionStatement');
        }

        const call = statement.expression;

        if (call.type !== 'CallExpression') {
            throw new Error('Expected a CallExpression');
        }

        const argument = call.arguments[2];

        if (argument?.type !== 'Literal') {
            throw new Error('Expected a Literal argument');
        }

        expect(argument.value).toBe('World');
    });

    test('getText with a location resolves against the updated document', function () {
        const wrapper = new AstWrapper('MsgBox(0, \'\', \'Hello\')');

        wrapper.update({
            range: { start: { line: 0, character: 15 }, end: { line: 0, character: 20 } },
            text: 'World',
        });

        const statement = wrapper.getProgram().body[0];

        if (statement?.type !== 'ExpressionStatement') {
            throw new Error('Expected an ExpressionStatement');
        }

        expect(wrapper.getText(statement.location)).toBe('MsgBox(0, \'\', \'World\')');
    });

    test('shifts positions of nodes after an inserted change', function () {
        const wrapper = new AstWrapper('Local $a = 1\nLocal $b = 2');

        wrapper.update({
            range: { start: { line: 1, character: 0 }, end: { line: 1, character: 0 } },
            text: '; comment\n',
        });

        expect(wrapper.getText()).toBe('Local $a = 1\n; comment\nLocal $b = 2');

        // The inserted comment line becomes its own statement, shifting the declaration.
        expect(wrapper.getProgram().body).toHaveLength(3);
        expect(wrapper.getProgram().body[1]?.type).toBe('SingleLineComment');

        const second = wrapper.getProgram().body[2];

        if (second?.type !== 'VariableDeclaration') {
            throw new Error('Expected a VariableDeclaration');
        }

        // The second declaration moved from line 2 down to line 3 (1-based)
        expect(second.location.start.line).toBe(3);
        expect(second.location.start.column).toBe(1);
        expect(second.location.start.offset).toBe(positionToOffset({ line: 2, character: 0 }, wrapper.getText()));
        expect(wrapper.getText(second.location)).toBe('Local $b = 2');
    });

    test('shifts positions of nodes after a deleted change', function () {
        const wrapper = new AstWrapper('Local $a = 1\n; comment\nLocal $b = 2');

        wrapper.update({
            range: { start: { line: 1, character: 0 }, end: { line: 1, character: 10 } },
            text: '',
        });

        expect(wrapper.getText()).toBe('Local $a = 1\nLocal $b = 2');

        const second = wrapper.getProgram().body[1];

        if (second?.type !== 'VariableDeclaration') {
            throw new Error('Expected a VariableDeclaration');
        }

        // The second declaration moved from line 3 up to line 2 (1-based)
        expect(second.location.start.line).toBe(2);
        expect(second.location.start.offset).toBe(positionToOffset({ line: 1, character: 0 }, wrapper.getText()));
        expect(wrapper.getText(second.location)).toBe('Local $b = 2');
    });

    test('offsets fragment positions to document coordinates after a branch re-parse', function () {
        const wrapper = new AstWrapper('Func test()\n    MsgBox(0, \'\', \'Hello\')\nEndFunc');

        wrapper.update({
            range: { start: { line: 1, character: 19 }, end: { line: 1, character: 24 } },
            text: 'World',
        });

        const func = wrapper.getProgram().body[0];

        if (func?.type !== 'FunctionDeclaration') {
            throw new Error('Expected a FunctionDeclaration');
        }

        const statement = func.body[0];

        if (statement.type !== 'ExpressionStatement') {
            throw new Error('Expected an ExpressionStatement');
        }

        const call = statement.expression;

        if (call.type !== 'CallExpression') {
            throw new Error('Expected a CallExpression');
        }

        const argument = call.arguments[2];

        if (argument?.type !== 'Literal') {
            throw new Error('Expected a Literal argument');
        }

        // Fragment-relative positions must be rebased to document coordinates
        expect(argument.location.start.line).toBe(2);
        expect(argument.location.start.column).toBe(19);
        expect(argument.value).toBe('World');
        expect(wrapper.getText(argument.location)).toBe('\'World\'');
    });

    test('falls back to a full re-parse when a change spans top-level boundaries', function () {
        const wrapper = new AstWrapper('MsgBox(1)\nMsgBox(2)');

        wrapper.update({
            range: { start: { line: 0, character: 0 }, end: { line: 1, character: 0 } },
            text: 'MsgBox(3)\n',
        });

        const expectedText = 'MsgBox(3)\nMsgBox(2)';

        expect(wrapper.getText()).toBe(expectedText);
        expect(wrapper.getProgram().body).toHaveLength(2);
        expect(wrapper.getProgram().body[0]?.type).toBe('ExpressionStatement');
        expect(wrapper.getProgram().body[1]?.type).toBe('ExpressionStatement');
    });

    test('a change confined to a comment leaves the statement set unchanged', function () {
        const wrapper = new AstWrapper('; hello\nMsgBox(1)');

        wrapper.update({
            range: { start: { line: 0, character: 2 }, end: { line: 0, character: 7 } },
            text: 'world',
        });

        expect(wrapper.getText()).toBe('; world\nMsgBox(1)');
        expect(wrapper.getProgram().body).toHaveLength(2);
    });

    test('deleting a whole middle line matches a fresh parse', function () {
        const wrapper = new AstWrapper('Local $a = 1\nLocal $b = 2\nLocal $c = 3');

        wrapper.update({
            range: { start: { line: 1, character: 0 }, end: { line: 2, character: 0 } },
            text: '',
        });

        expect(wrapper.getText()).toBe('Local $a = 1\nLocal $c = 3');
        expectEquivalentToFreshParse(wrapper);

        const last = wrapper.getProgram().body[1];

        if (last?.type !== 'VariableDeclaration') {
            throw new Error('Expected a VariableDeclaration');
        }

        expect(last.location.start.line).toBe(2);
        expect(wrapper.getText(last.location)).toBe('Local $c = 3');
    });

    test('deleting the first line matches a fresh parse', function () {
        const wrapper = new AstWrapper('Local $a = 1\nLocal $b = 2\nLocal $c = 3');

        wrapper.update({
            range: { start: { line: 0, character: 0 }, end: { line: 1, character: 0 } },
            text: '',
        });

        expect(wrapper.getText()).toBe('Local $b = 2\nLocal $c = 3');
        expectEquivalentToFreshParse(wrapper);

        const first = wrapper.getProgram().body[0];

        if (first?.type !== 'VariableDeclaration') {
            throw new Error('Expected a VariableDeclaration');
        }

        expect(first.location.start.line).toBe(1);
    });

    test('deleting the last line matches a fresh parse', function () {
        const wrapper = new AstWrapper('Local $a = 1\nLocal $b = 2\nLocal $c = 3');

        wrapper.update({
            range: { start: { line: 2, character: 0 }, end: { line: 2, character: 12 } },
            text: '',
        });

        expect(wrapper.getText()).toBe('Local $a = 1\nLocal $b = 2\n');
        expectEquivalentToFreshParse(wrapper);
        expect(wrapper.getProgram().body[2]).toBeUndefined();
    });

    test('deleting multiple statements at once matches a fresh parse', function () {
        const wrapper = new AstWrapper('MsgBox(1)\nMsgBox(2)\nMsgBox(3)\nMsgBox(4)');

        wrapper.update({
            range: { start: { line: 1, character: 0 }, end: { line: 3, character: 0 } },
            text: '',
        });

        expect(wrapper.getText()).toBe('MsgBox(1)\nMsgBox(4)');
        expectEquivalentToFreshParse(wrapper);
        expect(wrapper.getProgram().body).toHaveLength(2);
    });

    test('inserting lines between statements matches a fresh parse', function () {
        const wrapper = new AstWrapper('Local $a = 1\nLocal $b = 2');

        wrapper.update({
            range: { start: { line: 1, character: 0 }, end: { line: 1, character: 0 } },
            text: 'Local $middle = 3\nConsoleWrite($middle)\n',
        });

        expect(wrapper.getText()).toBe('Local $a = 1\nLocal $middle = 3\nConsoleWrite($middle)\nLocal $b = 2');
        expectEquivalentToFreshParse(wrapper);
        expect(wrapper.getProgram().body).toHaveLength(4);
        expect(wrapper.getProgram().body[3]?.location.start.line).toBe(4);
    });

    test('transient syntax errors recover on repair without losing the document', function () {
        const wrapper = new AstWrapper('Local $a = 1\nLocal $b = 2');

        // Break the document (unterminated string): Local $a = "1
        wrapper.update({
            range: { start: { line: 0, character: 11 }, end: { line: 0, character: 11 } },
            text: '"',
        });

        expect(wrapper.hasProgram()).toBe(false);
        expect(wrapper.getSyntaxError()).toBeDefined();
        expect(wrapper.getText()).toBe('Local $a = "1\nLocal $b = 2');

        // Repair it again by removing the stray quote
        wrapper.update({
            range: { start: { line: 0, character: 11 }, end: { line: 0, character: 12 } },
            text: '',
        });

        expect(wrapper.hasProgram()).toBe(true);
        expect(wrapper.getSyntaxError()).toBeUndefined();
        expect(wrapper.getText()).toBe('Local $a = 1\nLocal $b = 2');
        expectEquivalentToFreshParse(wrapper);
    });

    test('syntax errors in non-leading statements report document coordinates', function () {
        const wrapper = new AstWrapper('Local $a = 1\nLocal $b = 2\nLocal $c = 3');

        // Break the second statement (unterminated string): Local $b = "2
        wrapper.update({
            range: { start: { line: 1, character: 11 }, end: { line: 1, character: 11 } },
            text: '"',
        });

        expect(wrapper.hasProgram()).toBe(false);

        const syntaxError = wrapper.getSyntaxError();

        expect(syntaxError).toBeDefined();

        /*
         * The error location must be rebased to document coordinates: the
         * fragment starts on document line 2, so a fragment-relative line 1
         * report would be wrong.
         */
        expect(syntaxError?.location.start.line).toBe(2);
        expect(syntaxError?.location.start.offset).toBeGreaterThanOrEqual(
            positionToOffset({ line: 1, character: 0 }, wrapper.getText()),
        );
        expect(syntaxError?.location.end.line).toBeGreaterThanOrEqual(2);
    });

    test('changes larger than the region limit fall back to a full re-parse', function () {
        const wrapper = new ZeroRegionLimitWrapper('MsgBox(1)\nMsgBox(2)');

        wrapper.update({
            range: { start: { line: 0, character: 7 }, end: { line: 0, character: 8 } },
            text: '3',
        });

        expect(wrapper.getText()).toBe('MsgBox(3)\nMsgBox(2)');
        expectEquivalentToFreshParse(wrapper);
    });

    test('whitespace edits in inter-statement gaps anchor to the preceding sibling', function () {
        const wrapper = new AstWrapper('Local $a = 1\n\n\nLocal $b = 2');

        // Statement B keeps its identity: only statement A's region is reparsed.
        const statementB = wrapper.getProgram().body[wrapper.getProgram().body.length - 1];

        wrapper.update({
            range: { start: { line: 2, character: 0 }, end: { line: 2, character: 0 } },
            text: ' ',
        });

        expect(wrapper.getText()).toBe('Local $a = 1\n\n \nLocal $b = 2');
        expectEquivalentToFreshParse(wrapper);

        const body = wrapper.getProgram().body;

        // The gap now parses into EmptyStatements, but B itself is untouched.
        expect(body).toHaveLength(4);
        expect(body).toContain(statementB);
        expect(body.indexOf(statementB!)).toBe(3);
        expect(statementB!.location.start.line).toBe(4);
    });

    test('whitespace edits after the last statement anchor to the preceding sibling', function () {
        const wrapper = new AstWrapper('Local $a = 1\nLocal $b = 2\n');

        wrapper.update({
            range: { start: { line: 2, character: 0 }, end: { line: 2, character: 0 } },
            text: '   ',
        });

        expect(wrapper.getText()).toBe('Local $a = 1\nLocal $b = 2\n   ');
        expectEquivalentToFreshParse(wrapper);
        expect(wrapper.getProgram().body).toHaveLength(2);
    });
});
