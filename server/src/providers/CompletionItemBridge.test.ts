import { expect, test } from 'vitest';
import { CompletionItem, CompletionList } from 'vscode-languageserver';
import { Workspace } from '../autoit/Workspace';
import { URI } from 'vscode-uri';
import { CompletionItemBridge } from './CompletionItemBridge';

function getLabels(
    result: CompletionItem[] | CompletionList | undefined | null,
): string[] {
    if (result === undefined || result === null) {
        return [];
    }

    return Array.isArray(result)
        ? result.map((item) => item.label)
        : result.items.map((item) => item.label);
}

test('filters out variables declared after the cursor', () => {
    const workspace = new Workspace();
    const uri = URI.file('/after.au3');

    workspace.createOrUpdate(uri, `Global $early = 1

Global $late = 2
`);

    const bridge = new CompletionItemBridge(workspace);
    const labels = getLabels(bridge.resolveCompletionItems(
        uri.toString(),
        { line: 1, character: 0 },
    ));

    expect(labels).toContain('$early');
    expect(labels).not.toContain('$late');
});

test('keeps functions declared after the cursor (hoisting)', () => {
    const workspace = new Workspace();
    const uri = URI.file('/two.au3');

    workspace.createOrUpdate(uri, `Global $early = 1

Func CalledLater()
EndFunc
`);

    const bridge = new CompletionItemBridge(workspace);
    const labels = getLabels(bridge.resolveCompletionItems(
        uri.toString(),
        { line: 1, character: 0 },
    ));

    expect(labels).toContain('$early');
    expect(labels).toContain('CalledLater');
});

test('keeps globals declared after the cursor inside function bodies', () => {
    const workspace = new Workspace();
    const uri = URI.file('/global-in-function.au3');

    workspace.createOrUpdate(uri, `Func MyFunc()
    ; cursor
EndFunc

Global $lateGlobal = 1
`);

    const bridge = new CompletionItemBridge(workspace);
    const labels = getLabels(bridge.resolveCompletionItems(
        uri.toString(),
        { line: 1, character: 4 },
    ));

    expect(labels).toContain('$lateGlobal');
});

test('hides function-local variables declared after the cursor', () => {
    const workspace = new Workspace();
    const uri = URI.file('/three.au3');

    workspace.createOrUpdate(uri, `Func MyFunc($param)
    Local $localBefore = 1
    ; cursor
    Local $localAfter = 2
EndFunc
`);

    const bridge = new CompletionItemBridge(workspace);
    const labels = getLabels(bridge.resolveCompletionItems(
        uri.toString(),
        { line: 2, character: 0 },
    ));

    expect(labels).toContain('$param');
    expect(labels).toContain('$localBefore');
    expect(labels).not.toContain('$localAfter');
});

test('always includes native suggestions', () => {
    const workspace = new Workspace();
    const uri = URI.file('/four.au3');

    workspace.createOrUpdate(uri, '; empty');

    const bridge = new CompletionItemBridge(workspace);
    const labels = getLabels(bridge.resolveCompletionItems(
        uri.toString(),
        { line: 0, character: 0 },
    ));

    expect(labels).toContain('Exit');
});
