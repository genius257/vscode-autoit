import { expect, test, vi } from 'vitest';
import Script from './Script';
import { AutoIt3Configuration, Workspace } from './Workspace';
import { URI /* , Utils*/ } from 'vscode-uri';
import { Connection /* , RemoteConsole*/ } from 'vscode-languageserver';

test('something', () => {
    const workspace = new Workspace();

    const script1 = new Script('hello world!', URI.file('/one.au3'));
    const script2 = new Script('hello world!', URI.file('/two.au3'));

    workspace.add(script1);
    workspace.add(script2);

    expect(workspace.get('file:///one.au3')).toBe(script1);
    expect(workspace.get('file:///two.au3')).toBe(script2);
});

test('resolveInclude', () => {
    const connection: Partial<Connection> = {
        workspace: {
            getConfiguration: (): Promise<AutoIt3Configuration> => {
                return Promise.resolve({
                    version: '1.0.0',
                    userDefinedLibraries: [],
                    installDir: 'C:\\Program Files (x86)\\AutoIt3\\',
                    ignoreInternalInIncludes: false,
                });
            },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest: <P extends string>(type: P, params: P) => {
            return Promise.resolve(URI.parse(params).toString());
        },
    };

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const spy = vi.spyOn(connection.workspace!, 'getConfiguration');

    const workspace = new Workspace(connection as Connection);

    workspace.resolveInclude({
        file: 'D:\\users\\bob\\workspace\\one.au3',
        type: 'IncludeStatement',
        library: false,
        location: {
            start: {
                column: 1,
                line: 1,
                offset: 1,
            },
            end: {
                column: 1,
                line: 1,
                offset: 1,
            },
            source: '',
        },
    });

    // expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith('autoit3');

    // const installDir = "C:\\Program Files (x86)\\AutoIt3\\";

    // const uri = "D:\\users\\bob\\workspace\\one.au3".replace(/\\/g, '/');

    // console.log(Utils.resolvePath(URI.file(installDir), 'Include', uri).toString());
});
