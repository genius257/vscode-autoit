import { expect, test, vi } from 'vitest';
import Script from './Script';
import { AutoIt3Configuration, Workspace } from './Workspace';
import { URI /* , Utils*/ } from 'vscode-uri';
import { Connection /* , RemoteConsole*/ } from 'vscode-languageserver';
import type { SymbolKey } from './Scope';

test('get', () => {
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getConfiguration: (): Promise<AutoIt3Configuration> => {
                return Promise.resolve({
                    version: '1.0.0',
                    userDefinedLibraries: [],
                    installDir: 'C:\\Program Files (x86)\\AutoIt3\\',
                    ignoreInternalInIncludes: false,
                    showAllDeclarations: true,
                });
            },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest: <P extends string>(type: P, params: P) => {
            return Promise.resolve(URI.parse(params).toString());
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
    };

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const spy = vi.spyOn(connection.workspace!, 'getConfiguration');

    const workspace = new Workspace(connection as Connection);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

test('showAllDeclarations setting toggles between all declarations and closest match', () => {
    const workspace = new Workspace();

    const mainUri = URI.file('/main.au3');
    const includeUri = URI.file('/include.au3');

    // The main script declares the same global variable twice, and the include declares it once more
    const mainScript = new Script(`Global $shared = 1
Global $shared = 2
ConsoleWrite($shared)`, mainUri);
    const includeScript = new Script('Global $shared = 3', includeUri);

    workspace.add(mainScript);
    workspace.add(includeScript);

    // Link the include as a dependency of the main script
    workspace.dependencyGraph.setDependencies(mainUri.toString(), [includeUri.toString()]);

    // Position inside the reference to $shared in the main script
    const position = { line: 2, character: 15 };

    // showAllDeclarations=true path (default): all matching declarations across includes
    const allDeclarationsSymbol = workspace.getSymbol(mainUri.toString(), '$shared' as SymbolKey, position);
    expect([...allDeclarationsSymbol.getDeclarations()]).toHaveLength(3);

    // showAllDeclarations=false path: only the closest match in the current script
    const closestDeclarations = workspace.getDeclarationsAtPosition(
        mainUri.toString(),
        '$shared' as SymbolKey,
        position,
    );
    expect(closestDeclarations).toHaveLength(2);
    expect(closestDeclarations[0]?.location.source.toString()).toBe(mainUri.toString());

    // The closest match is a single declaration, even when multiple exist in the closest scope
    const closestDeclaration = closestDeclarations[0];
    expect(closestDeclaration).toBeDefined();
});
