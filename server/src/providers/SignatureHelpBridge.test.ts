import { expect, test } from 'vitest';
import { SignatureHelpBridge } from './SignatureHelpBridge';
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
     */
    const secondBridge = new SignatureHelpBridge(workspace);
    const secondHelp = secondBridge.resolveSignatureHelp({
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
