import { describe, expect, test } from 'vitest';
import Script from './Script';
import { getScopeLabel } from './DeclarationScope';
import type Symbol from './Symbol';

function getFirstDeclaration(symbol: Symbol | undefined) {
    return symbol === undefined
        ? undefined
        : [...symbol.getDeclarations()][0];
}

describe('getScopeLabel', () => {
    test('returns local for a variable declared inside a function', () => {
        const script = new Script(`Global $g
Func A()
    Local $x
EndFunc`);
        const declaration = getFirstDeclaration(
            script
                .getScope()
                .getSubscopes()
                .values()
                .next()
                .value
                ?.getSymbols()
                .get('$x'),
        );

        expect(declaration).toBeDefined();

        if (declaration === undefined) {
            throw new Error('declaration not found');
        }

        expect(getScopeLabel(script, declaration)).toBe('local');
    });

    test('returns global for a variable declared at global scope', () => {
        const script = new Script(`Global $g
Func A()
    Local $x
EndFunc`);
        const declaration = getFirstDeclaration(
            script
                .getScope()
                .getSymbols()
                .get('$g'),
        );

        expect(declaration).toBeDefined();

        if (declaration === undefined) {
            throw new Error('declaration not found');
        }

        expect(getScopeLabel(script, declaration)).toBe('global');
    });
});
