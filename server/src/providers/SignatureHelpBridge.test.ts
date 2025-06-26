import { expect, test } from 'vitest';
import { SignatureHelpBridge } from './SignatureHelpBridge';
import { Workspace } from '../autoit/Workspace';
import { URI } from 'vscode-uri';

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

    expect(signatureHelp?.signatures[0].label).toBe('A($a, $b, $c, $d)');

    expect(signatureHelp?.signatures[0].parameters).toHaveLength(4);

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

    expect(signatureHelp?.signatures[0].label).toBe('A($a, $b, $c, $d)');

    expect(signatureHelp?.signatures[0].parameters).toHaveLength(4);

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
        },
    );

    expect(signatureHelp).not.toBeNull();
    expect(signatureHelp?.activeSignature).toBe(0);
    expect(signatureHelp?.activeParameter).toBe(2);
    expect(signatureHelp?.signatures).toHaveLength(1);
    expect(signatureHelp?.signatures[0].label).toBe('A($a, $b, $c, $d)');
    expect(signatureHelp?.signatures[0].parameters).toHaveLength(4);
});

// MsgBox() ; Does not select parameter 1 as active parameter

// MsgBox(1,,,) ; Adding multiple commas, breaks the signature help
