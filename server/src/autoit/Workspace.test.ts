import { assert, expect, test } from 'vitest'
import Script from "./Script";
import { Workspace } from "./Workspace";
import { URI } from 'vscode-uri';

test('something', () => {
    const workspace = new Workspace();

    const script1 = new Script('hello world!', URI.file('/one.au3'));
    const script2 = new Script('hello world!', URI.file('/two.au3'));

    workspace.add(script1);
    workspace.add(script2);

    expect(workspace.get('file:///one.au3')).toBe(script1);
    expect(workspace.get('file:///two.au3')).toBe(script2);
});
