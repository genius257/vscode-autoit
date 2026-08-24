import { expect, test, describe } from 'vitest';
import AstWrapper from './AstWrapper';
import { positionToOffset } from './PositionHelper';

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
});
