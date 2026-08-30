import { describe, expect, test } from 'vitest';
import { canReuseSignatureHelpCache, SignatureHelpBridge } from './SignatureHelpBridge';
import { Workspace } from '../autoit/Workspace';
import { URI } from 'vscode-uri';
import { SignatureHelpTriggerKind } from 'vscode-languageserver';

test('resolveSignatureHelp', () => {
    const workspace = new Workspace();

    const uri = URI.file('/one.au3');
    let text = `A(1,2,3)
    
    Func A($a,$b,$c,$d)
        #code here
    EndFunc
    `;

    workspace.createOrUpdate(uri, text);

    const signatureHelpBridge = new SignatureHelpBridge(workspace);

    let signatureHelp = signatureHelpBridge.resolveSignatureHelp(
        {
            textDocument: {
                uri: uri.toString(),
            },
            position: {
                line: 0,
                character: 2,
            },
        },
    );

    expect(signatureHelp).not.toBeNull();

    expect(signatureHelp?.activeSignature).toBe(0);

    expect(signatureHelp?.activeParameter).toBe(0);

    expect(signatureHelp?.signatures).toHaveLength(1);

    expect(signatureHelp?.signatures[0]?.label).toBe('A($a, $b, $c, $d)');

    expect(signatureHelp?.signatures[0]?.parameters).toHaveLength(4);

    text = `A(1,2,3,)
    
    Func A($a,$b,$c,$d)
        #code here
    EndFunc
    `;

    workspace.createOrUpdate(uri, text);

    signatureHelp = signatureHelpBridge.resolveSignatureHelp(
        {
            textDocument: {
                uri: uri.toString(),
            },
            position: {
                line: 0,
                character: 8,
            },
        },
    );

    expect(signatureHelp).not.toBeNull();

    expect(signatureHelp?.activeSignature).toBe(0);

    expect(signatureHelp?.activeParameter).toBe(3);

    expect(signatureHelp?.signatures).toHaveLength(1);

    expect(signatureHelp?.signatures[0]?.label).toBe('A($a, $b, $c, $d)');

    expect(signatureHelp?.signatures[0]?.parameters).toHaveLength(4);

    text = `A(1)
    
    Func A($a,$b,$c,$d)
        #code here
    EndFunc
    `;

    workspace.createOrUpdate(uri, text);

    text = `A(1,,,)
    
    Func A($a,$b,$c,$d)
        #code here
    EndFunc
    `;

    workspace.createOrUpdate(uri, text);

    signatureHelp = signatureHelpBridge.resolveSignatureHelp(
        {
            textDocument: {
                uri: uri.toString(),
            },
            position: {
                line: 0,
                character: 5,
            },
            context: {
                isRetrigger: true,
                triggerKind: SignatureHelpTriggerKind.ContentChange,
            },
        },
    );

    expect(signatureHelp).not.toBeNull();
    expect(signatureHelp?.activeSignature).toBe(0);
    expect(signatureHelp?.activeParameter).toBe(2);
    expect(signatureHelp?.signatures).toHaveLength(1);
    expect(signatureHelp?.signatures[0]?.label).toBe('A($a, $b, $c, $d)');
    expect(signatureHelp?.signatures[0]?.parameters).toHaveLength(4);
});

test('retrigger after an incremental edit serves the updated document', () => {
    const workspace = new Workspace();

    const uri = URI.file('/retrigger.au3');
    const text = 'A(1,2)\nFunc A($a,$b,$c)\nEndFunc\n';

    workspace.createOrUpdate(uri, text);

    const script = workspace.get(uri);
    const revisionBefore = script?.getRevision();

    const firstBridge = new SignatureHelpBridge(workspace);
    const firstHelp = firstBridge.resolveSignatureHelp({
        textDocument: { uri: uri.toString() },
        position: { line: 0, character: 4 },
    });

    expect(firstHelp?.activeParameter).toBe(1);

    // Incremental edit: A(1,2) -> A(1,2,9)
    workspace.createOrUpdate(uri, {
        range: { start: { line: 0, character: 5 }, end: { line: 0, character: 5 } },
        text: ',9',
    });

    // The revision must have been bumped by the update
    expect(script?.getRevision()).toBe((revisionBefore ?? 0) + 1);

    /*
     * A retriggering request after an edit must not reuse AST nodes captured
     * from the pre-edit document (they were replaced by the branch splice).
     * The same bridge instance is deliberately reused, matching how main.ts
     * serves retrigger requests from its cache: since the document is valid,
     * the bridge must re-resolve instead of serving stale nodes.
     */
    const secondHelp = firstBridge.resolveSignatureHelp({
        textDocument: { uri: uri.toString() },
        position: { line: 0, character: 6 },
        context: {
            isRetrigger: true,
            triggerKind: SignatureHelpTriggerKind.ContentChange,
        },
    });

    expect(secondHelp).not.toBeNull();
    expect(secondHelp?.activeParameter).toBe(2);
    expect(secondHelp?.signatures[0]?.label).toBe('A($a, $b, $c)');
});

describe('canReuseSignatureHelpCache', () => {
    const cached = (overrides: Partial<{ uri: string, revision: number | undefined, hasSyntaxErrors: boolean }> = {}) => ({
        bridge: new SignatureHelpBridge(new Workspace()),
        uri: '/cached.au3',
        revision: 1,
        hasSyntaxErrors: false,
        ...overrides,
    });

    test('reuses the cache when retriggering an unchanged document', () => {
        expect(canReuseSignatureHelpCache(cached(), '/cached.au3', 1, false, true)).toBe(true);
    });

    test('does not reuse the cache without a retrigger', () => {
        expect(canReuseSignatureHelpCache(cached(), '/cached.au3', 1, false, false)).toBe(false);
    });

    test('does not reuse the cache for a different document', () => {
        expect(canReuseSignatureHelpCache(cached(), '/other.au3', 1, false, true)).toBe(false);
    });

    test('does not reuse the cache when the document was edited and is valid', () => {
        // Post-edit case: cached AST nodes must not be served.
        expect(canReuseSignatureHelpCache(cached(), '/cached.au3', 2, false, true)).toBe(false);
    });

    test('reuses the cache while the document stays in a syntax error state', () => {
        expect(canReuseSignatureHelpCache(cached({ hasSyntaxErrors: true }), '/cached.au3', 2, true, true)).toBe(true);
    });

    test('does not reuse the cache when syntax errors were repaired', () => {
        expect(canReuseSignatureHelpCache(cached({ hasSyntaxErrors: true }), '/cached.au3', 2, false, true)).toBe(false);
    });

    test('does not reuse an empty cache', () => {
        expect(canReuseSignatureHelpCache(undefined, '/cached.au3', 1, false, true)).toBe(false);
    });
});
