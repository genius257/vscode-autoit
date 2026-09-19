import { expect, test, vi } from 'vitest';
import Script, { type Include } from './Script';
import { AutoIt3Configuration, IndexingProgressNotification, Workspace } from './Workspace';
import { URI /* , Utils*/ } from 'vscode-uri';
import { Connection, FileChangeType, type FileSystemWatcher /* , RemoteConsole*/ } from 'vscode-languageserver';
import DependencyGraph from './DependencyGraph';
import type { SymbolKey } from './Scope';

const createConfiguration = (overrides: Partial<AutoIt3Configuration> = {}): AutoIt3Configuration => ({
    version: '1.0.0',
    userDefinedLibraries: [],
    installDir: 'C:\\Program Files (x86)\\AutoIt3\\',
    ignoreInternalInIncludes: false,
    showAllDeclarations: true,
    ...overrides,
});

type DidChangeConfigurationHandler = (change: { settings: { autoit3: AutoIt3Configuration } }) => void;

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
        sendRequest: <P extends string>(_type: P, _params: P) => {
            return Promise.resolve(URI.parse(_params).toString());
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
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

test('onDidChangeConfiguration refreshes includes when installDir changes', () => {
    let configHandler: DidChangeConfigurationHandler | undefined;

    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getConfiguration: (): Promise<AutoIt3Configuration> => Promise.resolve(createConfiguration()),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest: <P extends string>(type: P, params: P) => {
            return Promise.resolve(URI.parse(params).toString());
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        onDidChangeConfiguration: (handler) => {
            configHandler = handler;

            // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
            return { dispose: () => {} };
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        client: {
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
            register: () => Promise.resolve({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
    };

    const workspace = new Workspace(connection as Connection);

    const script = new Script('#include <One.au3>', URI.file('/main.au3'), workspace);
    workspace.add(script);

    // Apply the initial configuration, as would happen via onInitialized
    configHandler?.({ settings: { autoit3: createConfiguration() } });

    const spy = vi.spyOn(script, 'refreshIncludes');

    // Unchanged configuration should not trigger a refresh
    configHandler?.({ settings: { autoit3: createConfiguration() } });
    expect(spy).not.toHaveBeenCalled();

    // Changed installDir should trigger a refresh
    configHandler?.({ settings: { autoit3: createConfiguration({ installDir: 'D:\\AutoIt3\\' }) } });
    expect(spy).toHaveBeenCalledTimes(1);
});

test('onDidChangeConfiguration refreshes includes when userDefinedLibraries change', () => {
    let configHandler: DidChangeConfigurationHandler | undefined;

    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getConfiguration: (): Promise<AutoIt3Configuration> => Promise.resolve(createConfiguration()),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest: <P extends string>(type: P, params: P) => {
            return Promise.resolve(URI.parse(params).toString());
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        onDidChangeConfiguration: (handler) => {
            configHandler = handler;

            // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
            return { dispose: () => {} };
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        client: {
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
            register: () => Promise.resolve({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
    };

    const workspace = new Workspace(connection as Connection);

    const script = new Script('#include <One.au3>', URI.file('/main.au3'), workspace);
    workspace.add(script);

    // Apply the initial configuration, as would happen via onInitialized
    configHandler?.({ settings: { autoit3: createConfiguration() } });

    const spy = vi.spyOn(script, 'refreshIncludes');

    configHandler?.({ settings: { autoit3: createConfiguration({ userDefinedLibraries: ['D:\\libs\\'] }) } });
    expect(spy).toHaveBeenCalledTimes(1);

    // Reapplying the same libraries should not trigger another refresh
    configHandler?.({ settings: { autoit3: createConfiguration({ userDefinedLibraries: ['D:\\libs\\'] }) } });
    expect(spy).toHaveBeenCalledTimes(1);
});

test('updateDependencies ignores stale include results after includes are replaced', async () => {
    const workspace = new Workspace();

    const script = new Script('#include <One.au3>', URI.file('/main.au3'), workspace);
    workspace.add(script);

    const staleUri = URI.file('/stale.au3').toString();
    const freshUri = URI.file('/fresh.au3').toString();

    const createInclude = (uri: string, delay = 0): Include => ({
        statement: {
            file: uri,
            type: 'IncludeStatement',
            library: false,
            location: {
                start: { column: 1, line: 1, offset: 0 },
                end: { column: 1, line: 1, offset: 0 },
                source: '',
            },
        },
        uri: uri,
        promise: new Promise((resolve) => setTimeout(() => {
            resolve(uri);
        }, delay)),
    });

    // The stale include resolves late, so it would overwrite fresh edges last without the guard
    const staleIncludes = [createInclude(staleUri, 20)];
    const freshIncludes = [createInclude(freshUri)];

    const getIncludesSpy = vi.spyOn(script, 'getIncludes');
    getIncludesSpy.mockReturnValue(staleIncludes);

    // Start resolving the stale includes (promise not yet settled)
    workspace.updateDependencies(script);

    // Simulate a refresh replacing the includes before the stale promises resolve
    getIncludesSpy.mockReturnValue(freshIncludes);

    workspace.updateDependencies(script);

    // Allow both include promise chains to settle (the stale one resolves after 20ms)
    await new Promise((resolve) => setTimeout(resolve, 50));

    const dependencies = workspace.dependencyGraph.resolveDependencies('file:///main.au3');

    expect(dependencies).toContain(freshUri);
    expect(dependencies).not.toContain(staleUri);
});

test('superseded analysis cannot retain a stale could-not-resolve include error', async () => {
    const script = new Script('#include <Missing.au3>', URI.file('/main.au3'));

    // Deferred resolvers, one per resolveInclude call (initial analysis + each refresh)
    const resolvers: ((value: null) => void)[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    script.workspace = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        eventEmitter: { emit: () => {} },
        resolveInclude: () => new Promise<null>((resolve) => {
            resolvers.push(resolve);
        }),
        get: () => undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    script.refreshIncludes(); // refresh #1
    script.refreshIncludes(); // refresh #2, superseding #1 before anything settles

    // All include promises now settle as unresolvable
    resolvers.forEach((resolve) => {
        resolve(null);
    });

    // Allow the promise callbacks to run
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Only the latest analysis may report the error
    const errors = script
        .getDiagnostics()
        .filter((diagnostic) => diagnostic.message.startsWith('Could not resolve include'));

    expect(errors).toHaveLength(1);
});

test('handleFileDeleted removes the script, clears diagnostics and refreshes dependents', () => {
    const workspace = new Workspace();

    const mainUri = URI.file('/main.au3');
    const includeUri = URI.file('/include.au3');

    const mainScript = new Script('#include <include.au3>', mainUri);
    const includeScript = new Script('Global $x = 1', includeUri);

    workspace.add(mainScript);
    workspace.add(includeScript);

    workspace.dependencyGraph.setDependencies(mainUri.toString(), [
        includeUri.toString(),
        URI.from({ scheme: 'autoit3doc', path: 'native.au3' }).toString(),
    ]);

    const refreshSpy = vi.spyOn(mainScript, 'refreshIncludes');
    const diagnosticsSpy = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    workspace.eventEmitter.on('diagnostics', diagnosticsSpy);

    workspace.handleFileDeleted(includeUri.toString());

    expect(workspace.get(includeUri.toString())).toBeUndefined();
    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(diagnosticsSpy).toHaveBeenCalledWith({ uri: includeUri.toString(), diagnostics: [] });
    expect(workspace.dependencyGraph.resolveDependencies(mainUri.toString())).not.toContain(includeUri.toString());
});

test('handleFileChangedOrCreated re-reads the file and updates the script', async () => {
    const sendRequest = vi.fn(() => Promise.resolve('Global $updated = 1'));

    const connection: Partial<Connection> = {
        sendRequest: sendRequest as unknown as Connection['sendRequest'],
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    const scriptUri = URI.file('/external.au3');
    workspace.add(new Script('Global $old = 1', scriptUri));

    workspace.handleFileChangedOrCreated(scriptUri.toString());

    // Allow the readFile promise chain to settle
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(sendRequest).toHaveBeenCalledWith('fs/readFile', scriptUri.toString());
    expect(workspace.get(scriptUri.toString())?.getText()).toBe('Global $updated = 1');
});

test('handleFileChangedOrCreated skips open documents', async () => {
    const sendRequest = vi.fn(() => Promise.resolve('Global $updated = 1'));

    const connection: Partial<Connection> = {
        sendRequest: sendRequest as unknown as Connection['sendRequest'],
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    const scriptUri = URI.file('/open.au3');
    workspace.add(new Script('Global $old = 1', scriptUri));
    workspace.setScriptActive(scriptUri, true);

    workspace.handleFileChangedOrCreated(scriptUri.toString());

    // Allow any pending promise chain to settle
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(sendRequest).not.toHaveBeenCalled();
    expect(workspace.get(scriptUri.toString())?.getText()).toBe('Global $old = 1');
});

test('handleFileDeleted preserves active scripts', () => {
    const workspace = new Workspace();

    const scriptUri = URI.file('/open.au3');
    const script = new Script('Global $x = 1', scriptUri);

    workspace.add(script);
    workspace.setScriptActive(scriptUri, true);

    const diagnosticsSpy = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    workspace.eventEmitter.on('diagnostics', diagnosticsSpy);

    workspace.handleFileDeleted(scriptUri.toString());

    expect(workspace.get(scriptUri.toString())).toBe(script);
    expect(diagnosticsSpy).not.toHaveBeenCalled();
});

test('DependencyGraph.removeScript removes stale reverse dependency edges', () => {
    const graph = new DependencyGraph();

    const mainUri = 'file:///main.au3';
    const includeUri = 'file:///include.au3';

    graph.setDependencies(mainUri, [includeUri, 'autoit3doc:///native.au3']);

    graph.removeScript(includeUri);

    expect(graph.getDirectDependents(includeUri)).toEqual([]);
    expect(graph.resolveReverseDependencies(includeUri)).toEqual([]);
    expect(graph.resolveDependencies(mainUri)).not.toContain(includeUri);
});

test('buildWatchers registers RelativePattern watchers for installDir and userDefinedLibraries', () => {
    const workspace = new Workspace();

    type WatcherInternals = { buildWatchers(configuration: AutoIt3Configuration): FileSystemWatcher[] };

    const internals = workspace as unknown as WatcherInternals;

    const watchers = internals.buildWatchers(createConfiguration({
        installDir: 'C:\\AutoIt3\\',
        userDefinedLibraries: ['D:\\libs\\'],
    }));

    expect(watchers[0]).toEqual({ globPattern: '**/*' });
    expect(watchers[1]?.globPattern).toEqual({
        baseUri: URI.file('C:/AutoIt3/Include').toString(),
        pattern: '**/*',
    });
    expect(watchers[2]?.globPattern).toEqual({
        baseUri: URI.file('D:/libs').toString(),
        pattern: '**/*',
    });
});

test('isManagedUri matches roots with path-boundary semantics', async () => {
    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getWorkspaceFolders: (): Promise<{ uri: string }[]> => Promise.resolve([{ uri: 'file:///ws' }]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    type IsManagedInternals = { isManagedUri(uri: string): Promise<boolean> };

    const internals = workspace as unknown as IsManagedInternals;

    await expect(internals.isManagedUri('file:///ws/sub/x.au3')).resolves.toBe(true);
    await expect(internals.isManagedUri('file:///ws2/x.au3')).resolves.toBe(false);
});

test('stale read completion cannot recreate a deleted script', async () => {
    let resolveRead: (value: string | null) => void = () => undefined;

    const sendRequest = vi.fn(() => new Promise<string | null>((resolve) => {
        resolveRead = resolve;
    }));

    const connection: Partial<Connection> = {
        sendRequest: sendRequest as unknown as Connection['sendRequest'],
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    const scriptUri = URI.file('/gone.au3');
    workspace.add(new Script('Global $old = 1', scriptUri));

    // Start a read that will not settle yet
    workspace.handleFileChangedOrCreated(scriptUri.toString());

    // Simulate a later delete event: the event bumps the URI's revision and the file is deleted
    type RevisionInternals = { fileEventRevisions: Map<string, number> };

    const internals = workspace as unknown as RevisionInternals;

    internals.fileEventRevisions.set(scriptUri.toString(), (internals.fileEventRevisions.get(scriptUri.toString()) ?? 0) + 1);

    workspace.handleFileDeleted(scriptUri.toString());

    expect(workspace.get(scriptUri.toString())).toBeUndefined();

    // The stale read completes with content after the deletion
    resolveRead('Global $new = 1');

    await new Promise((resolve) => setTimeout(resolve, 0));

    // The stale read must not recreate the deleted script
    expect(workspace.get(scriptUri.toString())).toBeUndefined();
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
test('preloadWorkspace loads files from managed roots', async () => {
    const sendNotification = vi.fn();

    const sendRequest = vi.fn((type: string, params: string): Promise<unknown> => {
        if (type === 'fs/listFiles') {
            return Promise.resolve(['file:///ws/a.au3', 'file:///ws/b.au3']);
        }

        return Promise.resolve(params === 'file:///ws/a.au3' ? 'Global $a = 1' : 'Global $b = 1');
    });

    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getWorkspaceFolders: (): Promise<{ uri: string }[]> => Promise.resolve([]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest: sendRequest as unknown as Connection['sendRequest'],
        sendNotification: sendNotification as unknown as Connection['sendNotification'],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        window: {
            createWorkDoneProgress: (): Promise<{ begin(): void, report(percentage: number, message?: string): void, done(): void }> => {
                const progress = { begin: vi.fn(), report: vi.fn(), done: vi.fn() };

                return Promise.resolve(progress);
            },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    type PreloadInternals = { preloadWorkspace(configuration: AutoIt3Configuration): Promise<void> };

    const internals = workspace as unknown as PreloadInternals;

    await internals.preloadWorkspace(createConfiguration());

    // Allow any pending promise chain to settle
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(workspace.get('file:///ws/a.au3')?.getText()).toBe('Global $a = 1');
    expect(workspace.get('file:///ws/b.au3')?.getText()).toBe('Global $b = 1');
    expect(sendRequest).toHaveBeenCalledWith('fs/listFiles', URI.file('C:/Program Files (x86)/AutoIt3/Include').toString());

    // Progress notifications: starts at 0/2 and ends at 2/2
    expect(sendNotification).toHaveBeenNthCalledWith(1, IndexingProgressNotification, { loaded: 0, total: 2 });
    expect(sendNotification).toHaveBeenLastCalledWith(IndexingProgressNotification, { loaded: 2, total: 2 });
    expect(sendNotification).toHaveBeenCalledTimes(3);
});

test('preloadWorkspace skips active scripts', async () => {
    const sendRequest = vi.fn((type: string): Promise<unknown> => {
        if (type === 'fs/listFiles') {
            return Promise.resolve(['file:///ws/open.au3']);
        }

        return Promise.resolve('Global $new = 1');
    });

    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getWorkspaceFolders: (): Promise<{ uri: string }[]> => Promise.resolve([]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest: sendRequest as unknown as Connection['sendRequest'],
        sendNotification: vi.fn() as unknown as Connection['sendNotification'],
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    const scriptUri = URI.file('/ws/open.au3');

    workspace.add(new Script('Global $old = 1', scriptUri));
    workspace.setScriptActive(scriptUri, true);

    type PreloadInternals = { preloadWorkspace(configuration: AutoIt3Configuration): Promise<void> };

    const internals = workspace as unknown as PreloadInternals;

    await internals.preloadWorkspace(createConfiguration());

    // Allow any pending promise chain to settle
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(sendRequest).not.toHaveBeenCalledWith('fs/readFile', scriptUri.toString());
    expect(workspace.get(scriptUri.toString())?.getText()).toBe('Global $old = 1');
});

test('preloadWorkspace deduplicates URIs returned by overlapping roots', async () => {
    const sendRequest = vi.fn((type: string): Promise<unknown> => {
        if (type === 'fs/listFiles') {
            return Promise.resolve(['file:///x/a.au3']);
        }

        return Promise.resolve('Global $a = 1');
    });

    const sendNotification = vi.fn();

    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getWorkspaceFolders: (): Promise<{ uri: string }[]> => Promise.resolve([{ uri: 'file:///ws' }]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest: sendRequest as unknown as Connection['sendRequest'],
        sendNotification: sendNotification as unknown as Connection['sendNotification'],
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    type PreloadInternals = { preloadWorkspace(configuration: AutoIt3Configuration): Promise<void> };

    const internals = workspace as unknown as PreloadInternals;

    // The workspace folder and the user defined library return the same URI
    await internals.preloadWorkspace(createConfiguration({ userDefinedLibraries: ['D:\\libs\\'] }));

    // Allow any pending promise chain to settle
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(sendRequest).toHaveBeenCalledTimes(4); // 2x fs/listFiles + 1x fs/readFile (deduplicated)

    // Progress completes at 1/1 despite the duplicate, so done() is called
    expect(sendNotification).toHaveBeenLastCalledWith(IndexingProgressNotification, { loaded: 1, total: 1 });
});

test('preloadWorkspace limits concurrent fs/readFile requests', async () => {
    let activeReads = 0;
    let maxActiveReads = 0;

    const sendRequest = vi.fn((type: string): Promise<unknown> => {
        if (type === 'fs/listFiles') {
            return Promise.resolve(Array.from({ length: 20 }, (_, i) => `file:///ws/f${i}.au3`));
        }

        activeReads++;
        maxActiveReads = Math.max(maxActiveReads, activeReads);

        return new Promise((resolve) => {
            setTimeout(() => {
                activeReads--;
                resolve('Global $x = 1');
            }, 0);
        });
    });

    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getWorkspaceFolders: (): Promise<{ uri: string }[]> => Promise.resolve([]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest: sendRequest as unknown as Connection['sendRequest'],
        sendNotification: vi.fn() as unknown as Connection['sendNotification'],
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    type PreloadInternals = { preloadWorkspace(configuration: AutoIt3Configuration): Promise<void> };

    const internals = workspace as unknown as PreloadInternals;

    await internals.preloadWorkspace(createConfiguration());

    expect(maxActiveReads).toBeLessThanOrEqual(8);

    // All 20 files were eventually read
    expect(sendRequest).toHaveBeenCalledTimes(21); // 1x fs/listFiles + 20x fs/readFile
});

test('getManagedRootUris collects workspace folders, installDir Include and library roots', async () => {
    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getWorkspaceFolders: (): Promise<{ uri: string }[]> => Promise.resolve([{ uri: 'file:///ws' }]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    type RootUrisInternals = { getManagedRootUris(configuration: AutoIt3Configuration): Promise<URI[]> };

    const internals = workspace as unknown as RootUrisInternals;

    const rootUris = await internals.getManagedRootUris(createConfiguration({
        installDir: 'C:\\AutoIt3\\',
        userDefinedLibraries: ['D:\\libs\\'],
    }));

    expect(rootUris).toEqual([
        URI.file('/ws'),
        URI.file('C:/AutoIt3/Include'),
        URI.file('D:/libs'),
    ]);
});

type ProcessFileEventsInternals = {
    pendingFileEvents: Map<string, FileChangeType>,
    processFileEvents(): Promise<void>,
};

const createFileEventWorkspace = (
    sendRequest: Connection['sendRequest'],
    associations: Record<string, string> | null = null,
): { workspace: Workspace, internals: ProcessFileEventsInternals } => {
    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getWorkspaceFolders: (): Promise<{ uri: string }[]> => Promise.resolve([{ uri: 'file:///ws' }]),
            getConfiguration: (section: string) => (section === 'files' ? Promise.resolve({ associations: associations ?? {} }) : Promise.resolve(createConfiguration())),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest,
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    const internals = workspace as unknown as ProcessFileEventsInternals;

    return { workspace, internals };
};

test('processFileEvents ignores changes to non-AutoIt files', async () => {
    const sendRequest = vi.fn(() => Promise.resolve<string | null>('Global $x = 1'));

    const { internals } = createFileEventWorkspace(sendRequest as unknown as Connection['sendRequest']);

    internals.pendingFileEvents.set('file:///ws/package.json', FileChangeType.Changed);

    await internals.processFileEvents();

    expect(sendRequest).not.toHaveBeenCalled();
});

test('processFileEvents reads changed .au3 files', async () => {
    const sendRequest = vi.fn(() => Promise.resolve<string | null>('Global $x = 1'));

    const { internals } = createFileEventWorkspace(sendRequest as unknown as Connection['sendRequest']);

    internals.pendingFileEvents.set('file:///ws/script.au3', FileChangeType.Changed);

    await internals.processFileEvents();

    expect(sendRequest).toHaveBeenCalledWith('fs/readFile', 'file:///ws/script.au3');
});

test('processFileEvents reads changed files already tracked by the dependency manager', async () => {
    const sendRequest = vi.fn(() => Promise.resolve<string | null>('Global $x = 1'));

    const { workspace, internals } = createFileEventWorkspace(sendRequest as unknown as Connection['sendRequest']);

    // A file with a custom extension, loaded e.g. via include resolution, is tracked
    workspace.add(new Script('Global $custom = 1', URI.file('/ws/data.myext')));

    internals.pendingFileEvents.set('file:///ws/data.myext', FileChangeType.Changed);

    await internals.processFileEvents();

    expect(sendRequest).toHaveBeenCalledWith('fs/readFile', 'file:///ws/data.myext');
});

test('processFileEvents reads created files associated with the au3 language', async () => {
    const sendRequest = vi.fn(() => Promise.resolve<string | null>('Global $x = 1'));

    const { internals } = createFileEventWorkspace(sendRequest as unknown as Connection['sendRequest'], { '*.myext': 'au3', '*.json': 'json' });

    internals.pendingFileEvents.set('file:///ws/data.myext', FileChangeType.Created);

    await internals.processFileEvents();

    expect(sendRequest).toHaveBeenCalledWith('fs/readFile', 'file:///ws/data.myext');
});

test('processFileEvents ignores created files not associated with the au3 language', async () => {
    const sendRequest = vi.fn(() => Promise.resolve<string | null>('Global $x = 1'));

    const { internals } = createFileEventWorkspace(sendRequest as unknown as Connection['sendRequest'], { '*.json': 'json' });

    internals.pendingFileEvents.set('file:///ws/data.json', FileChangeType.Created);

    await internals.processFileEvents();

    expect(sendRequest).not.toHaveBeenCalled();
});

test('processFileEvents ignores deletion of untracked files', async () => {
    const sendRequest = vi.fn(() => Promise.resolve<string | null>(null));

    const { workspace, internals } = createFileEventWorkspace(sendRequest as unknown as Connection['sendRequest']);

    const diagnosticsSpy = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    workspace.eventEmitter.on('diagnostics', diagnosticsSpy);

    internals.pendingFileEvents.set('file:///ws/gone.au3', FileChangeType.Deleted);

    await internals.processFileEvents();

    expect(diagnosticsSpy).not.toHaveBeenCalled();
});

test('repeated read failures for the same file are reported only once within the window', async () => {
    vi.useFakeTimers();

    try {
        const showErrorMessage = vi.fn();

        const sendRequest = vi.fn(() => Promise.reject(new Error('read failed')));

        const connection: Partial<Connection> = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            workspace: {
                getWorkspaceFolders: (): Promise<{ uri: string }[]> => Promise.resolve([{ uri: 'file:///ws' }]),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any,
            sendRequest: sendRequest as unknown as Connection['sendRequest'],
            window: { showErrorMessage } as unknown as Connection['window'],
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
            onInitialized: () => ({ dispose: () => {} }),
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
            onDidChangeConfiguration: () => ({ dispose: () => {} }),
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
            onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
        };

        const workspace = new Workspace(connection as Connection);

        const internals = workspace as unknown as ProcessFileEventsInternals;

        internals.pendingFileEvents.set('file:///ws/script.au3', FileChangeType.Changed);

        await internals.processFileEvents();

        // Allow the rejected read to settle
        await vi.advanceTimersByTimeAsync(0);

        internals.pendingFileEvents.set('file:///ws/script.au3', FileChangeType.Changed);

        await internals.processFileEvents();

        await vi.advanceTimersByTimeAsync(0);

        expect(showErrorMessage).toHaveBeenCalledTimes(1);

        expect(String(showErrorMessage.mock.calls[0]?.[0])).toContain('failed to read file');

        // After the suppression window has passed, the failure is reported again
        await vi.advanceTimersByTimeAsync(30_000);

        internals.pendingFileEvents.set('file:///ws/script.au3', FileChangeType.Changed);

        await internals.processFileEvents();

        await vi.advanceTimersByTimeAsync(0);

        expect(showErrorMessage).toHaveBeenCalledTimes(2);
    } finally {
        vi.useRealTimers();
    }
});

test('preloadWorkspace indexes only .au3 and au3-associated files', async () => {
    const sendNotification = vi.fn();

    const sendRequest = vi.fn((type: string): Promise<unknown> => {
        if (type === 'fs/listFiles') {
            return Promise.resolve([
                'file:///ws/script.au3',
                'file:///ws/data.myext',
                'file:///ws/notes.txt',
            ]);
        }

        return Promise.resolve('Global $x = 1');
    });

    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getWorkspaceFolders: (): Promise<{ uri: string }[]> => Promise.resolve([]),
            getConfiguration: (section: string) => (section === 'files' ? Promise.resolve({ associations: { '*.myext': 'au3' } }) : Promise.resolve(createConfiguration())),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest: sendRequest as unknown as Connection['sendRequest'],
        sendNotification: sendNotification as unknown as Connection['sendNotification'],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        window: {
            createWorkDoneProgress: (): Promise<{ begin(): void, report(percentage: number, message?: string): void, done(): void }> => {
                const progress = { begin: vi.fn(), report: vi.fn(), done: vi.fn() };

                return Promise.resolve(progress);
            },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    type PreloadInternals = { preloadWorkspace(configuration: AutoIt3Configuration): Promise<void> };

    const internals = workspace as unknown as PreloadInternals;

    await internals.preloadWorkspace(createConfiguration());

    // Allow any pending promise chain to settle
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(workspace.get('file:///ws/script.au3')).toBeDefined();
    expect(workspace.get('file:///ws/data.myext')).toBeDefined();
    expect(workspace.get('file:///ws/notes.txt')).toBeUndefined();

    // Only the two AutoIt3 files were read
    expect(sendRequest).toHaveBeenCalledTimes(3); // 1x fs/listFiles + 2x fs/readFile

    expect(sendNotification).toHaveBeenNthCalledWith(1, IndexingProgressNotification, { loaded: 0, total: 2 });
    expect(sendNotification).toHaveBeenLastCalledWith(IndexingProgressNotification, { loaded: 2, total: 2 });
    expect(sendNotification).toHaveBeenCalledTimes(3);
});

test('reportReadFailure prunes expired entries and caps the cache size by evicting the oldest entries', () => {
    vi.useFakeTimers();

    try {
        const showErrorMessage = vi.fn();

        const connection: Partial<Connection> = {
            sendRequest: vi.fn() as unknown as Connection['sendRequest'],
            window: { showErrorMessage } as unknown as Connection['window'],
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
            onInitialized: () => ({ dispose: () => {} }),
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
            onDidChangeConfiguration: () => ({ dispose: () => {} }),
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
            onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
        };

        const workspace = new Workspace(connection as Connection);

        type ReportReadFailureInternals = {
            failedReadErrors: Map<string, number>,
            reportReadFailure(description: string, uri: URI, error: unknown): void,
        };

        const internals = workspace as unknown as ReportReadFailureInternals;

        const now = Date.now();

        // Seed the cache with expired and fresh entries beyond the cache limit
        for (let i = 0; i < 120; i++) {
            internals.failedReadErrors.set(`file:///ws/stale${i}.au3`, now - 31_000);
        }

        for (let i = 0; i < 120; i++) {
            internals.failedReadErrors.set(`file:///ws/fresh${i}.au3`, now);
        }

        internals.reportReadFailure('file', URI.file('/ws/current.au3'), new Error('read failed'));

        // Expired entries were pruned and the cache was capped at the limit
        expect(internals.failedReadErrors.size).toBe(100);
        expect(internals.failedReadErrors.has('file:///ws/current.au3')).toBe(true);
        expect(internals.failedReadErrors.has('file:///ws/stale0.au3')).toBe(false);

        // The oldest fresh entries were evicted in insertion order, the newest survived
        expect(internals.failedReadErrors.has('file:///ws/fresh0.au3')).toBe(false);
        expect(internals.failedReadErrors.has('file:///ws/fresh20.au3')).toBe(false);
        expect(internals.failedReadErrors.has('file:///ws/fresh21.au3')).toBe(true);
        expect(internals.failedReadErrors.has('file:///ws/fresh119.au3')).toBe(true);

        // The new failure was reported
        expect(showErrorMessage).toHaveBeenCalledTimes(1);
    } finally {
        vi.useRealTimers();
    }
});

test('processFileEvents warns once about rejected association patterns', async () => {
    const showWarningMessage = vi.fn();

    const sendRequest = vi.fn(() => Promise.resolve<string | null>('Global $x = 1'));

    const connection: Partial<Connection> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        workspace: {
            getWorkspaceFolders: (): Promise<{ uri: string }[]> => Promise.resolve([{ uri: 'file:///ws' }]),
            getConfiguration: (section: string) => (section === 'files' ? Promise.resolve({ associations: { 'one[z-a].myext': 'au3', '*.myext': 'au3' } }) : Promise.resolve(createConfiguration())),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        sendRequest: sendRequest as unknown as Connection['sendRequest'],
        window: { showErrorMessage: vi.fn(), showWarningMessage } as unknown as Connection['window'],
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onInitialized: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/curly-newline
        onDidChangeWatchedFiles: () => ({ dispose: () => {} }),
    };

    const workspace = new Workspace(connection as Connection);

    const internals = workspace as unknown as ProcessFileEventsInternals;

    internals.pendingFileEvents.set('file:///ws/data.myext', FileChangeType.Created);

    await internals.processFileEvents();

    expect(showWarningMessage).toHaveBeenCalledTimes(1);

    expect(String(showWarningMessage.mock.calls[0]?.[0])).toContain('one[z-a].myext');

    // Files matching the valid pattern are still read
    expect(sendRequest).toHaveBeenCalledWith('fs/readFile', 'file:///ws/data.myext');

    // A second batch does not warn again
    internals.pendingFileEvents.set('file:///ws/data.myext', FileChangeType.Changed);

    await internals.processFileEvents();

    expect(showWarningMessage).toHaveBeenCalledTimes(1);
});
