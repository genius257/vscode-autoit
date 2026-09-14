import { expect, test } from 'vitest';
import { CompletionItem, CompletionList } from 'vscode-languageserver';
import { Workspace, type AutoIt3Configuration } from '../autoit/Workspace';
import { URI } from 'vscode-uri';
import { CompletionItemBridge } from './CompletionItemBridge';

function getItems(
    result: CompletionItem[] | CompletionList | undefined | null,
): CompletionItem[] {
    if (result === undefined || result === null) {
        return [];
    }

    return Array.isArray(result) ? result : result.items;
}

function getLabels(
    result: CompletionItem[] | CompletionList | undefined | null,
): string[] {
    return getItems(result).map((item) => item.label);
}

function setConfiguration(workspace: Workspace, configuration: Partial<AutoIt3Configuration>): void {
    (workspace as unknown as { configuration: AutoIt3Configuration | null }).configuration = {
        installDir: null,
        userDefinedLibraries: [],
        version: '3.3.14.5',
        ignoreInternalInIncludes: false,
        showAllDeclarations: true,
        ...configuration,
    };
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

test('suggests workspace symbols demoted with an include insertion edit', () => {
    const workspace = new Workspace();
    const otherUri = URI.file('/ws/other.au3');
    const mainUri = URI.file('/ws/main.au3');

    workspace.createOrUpdate(otherUri, `Func BackupData()\nEndFunc\n\nGlobal $g_cache = 1\n`);
    workspace.createOrUpdate(mainUri, 'Func Foo()\n    Back\nEndFunc\n');

    const bridge = new CompletionItemBridge(workspace);
    const items = getItems(bridge.resolveCompletionItems(
        mainUri.toString(),
        { line: 1, character: 8 },
    ));

    const backup = items.find((item) => item.label === 'BackupData');

    expect(backup).toBeDefined();
    expect(backup?.sortText).toBe('zzzzbackupdata');
    expect(backup?.labelDetails?.description).toBe('other.au3');
    expect(backup?.additionalTextEdits).toEqual([
        {
            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
            newText: '#include "other.au3"\n',
        },
    ]);

    // Workspace symbols rank after native suggestions
    const exitIndex = items.findIndex((item) => item.label === 'Exit');

    expect(items.findIndex((item) => item.label === 'BackupData')).toBeGreaterThan(exitIndex);
});

test('suggests workspace global variables demoted', () => {
    const workspace = new Workspace();
    const otherUri = URI.file('/ws/other.au3');
    const mainUri = URI.file('/ws/main.au3');

    workspace.createOrUpdate(otherUri, 'Global $g_cache = 1\n');
    workspace.createOrUpdate(mainUri, 'Func Foo()\n    cach\nEndFunc\n');

    const bridge = new CompletionItemBridge(workspace);
    const items = getItems(bridge.resolveCompletionItems(
        mainUri.toString(),
        { line: 1, character: 8 },
    ));

    const cache = items.find((item) => item.label === '$g_cache');

    expect(cache).toBeDefined();
    expect(cache?.sortText).toBe('zzzz$g_cache');
    expect(cache?.labelDetails?.description).toBe('other.au3');
});

test('inserts the include after the last top-level include statement', () => {
    const workspace = new Workspace();
    const otherUri = URI.file('/ws/other.au3');
    const libUri = URI.file('/ws/lib/helper.au3');
    const mainUri = URI.file('/ws/main.au3');

    workspace.createOrUpdate(otherUri, 'Func BackupData()\nEndFunc\n');
    workspace.createOrUpdate(libUri, 'Func HelperA()\nEndFunc\n');
    workspace.createOrUpdate(mainUri, `#include "helper.au3"\n\nFunc Foo()\n    Back\nEndFunc\n`);

    const bridge = new CompletionItemBridge(workspace);
    const items = getItems(bridge.resolveCompletionItems(
        mainUri.toString(),
        { line: 3, character: 8 },
    ));

    const backup = items.find((item) => item.label === 'BackupData');

    expect(backup?.additionalTextEdits).toEqual([
        {
            range: { start: { line: 1, character: 0 }, end: { line: 1, character: 0 } },
            newText: '#include "other.au3"\n',
        },
    ]);
});

test('does not suggest workspace symbols without a typed prefix', () => {
    const workspace = new Workspace();
    const otherUri = URI.file('/ws/other.au3');
    const mainUri = URI.file('/ws/main.au3');

    workspace.createOrUpdate(otherUri, 'Func BackupData()\nEndFunc\n');
    workspace.createOrUpdate(mainUri, 'Func Foo()\n    \nEndFunc\n');

    const bridge = new CompletionItemBridge(workspace);
    const labels = getLabels(bridge.resolveCompletionItems(
        mainUri.toString(),
        { line: 1, character: 4 },
    ));

    expect(labels).not.toContain('BackupData');
});

test('does not suggest workspace symbols when disabled in configuration', () => {
    const workspace = new Workspace();
    const otherUri = URI.file('/ws/other.au3');
    const mainUri = URI.file('/ws/main.au3');

    setConfiguration(workspace, { workspaceCompletions: false });

    workspace.createOrUpdate(otherUri, 'Func BackupData()\nEndFunc\n');
    workspace.createOrUpdate(mainUri, 'Func Foo()\n    Back\nEndFunc\n');

    const bridge = new CompletionItemBridge(workspace);
    const labels = getLabels(bridge.resolveCompletionItems(
        mainUri.toString(),
        { line: 1, character: 8 },
    ));

    expect(labels).not.toContain('BackupData');
});

test('does not suggest symbols from the current document twice', () => {
    const workspace = new Workspace();
    const mainUri = URI.file('/ws/main.au3');

    workspace.createOrUpdate(mainUri, 'Func BackupData()\nEndFunc\n\nFunc Foo()\n    Back\nEndFunc\n');

    const bridge = new CompletionItemBridge(workspace);
    const items = getItems(bridge.resolveCompletionItems(
        mainUri.toString(),
        { line: 4, character: 8 },
    ));

    expect(items.filter((item) => item.label === 'BackupData')).toHaveLength(1);
});

test('deduplicates workspace symbols declared in multiple files', () => {
    const workspace = new Workspace();
    const firstUri = URI.file('/ws/a_first.au3');
    const secondUri = URI.file('/ws/b_second.au3');
    const mainUri = URI.file('/ws/main.au3');

    workspace.createOrUpdate(firstUri, 'Func BackupData()\nEndFunc\n');
    workspace.createOrUpdate(secondUri, 'Func BackupData()\nEndFunc\n');
    workspace.createOrUpdate(mainUri, 'Func Foo()\n    Back\nEndFunc\n');

    const bridge = new CompletionItemBridge(workspace);
    const items = getItems(bridge.resolveCompletionItems(
        mainUri.toString(),
        { line: 1, character: 8 },
    ));

    const matches = items.filter((item) => item.label === 'BackupData');

    expect(matches).toHaveLength(1);
    expect(matches[0]?.labelDetails?.description).toBe('a_first.au3');
});
