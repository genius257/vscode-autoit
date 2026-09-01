import { type AutoIt3, type GrammarSource } from 'autoit3-pegjs';
import { Connection, Diagnostic, DidChangeConfigurationNotification, DidChangeWatchedFilesNotification, Disposable, FileChangeType, type FileSystemWatcher, Range } from 'vscode-languageserver';
import { URI, Utils } from 'vscode-uri';
import Script from './Script';
import native from './native.au3?raw';
import { isAbsolutePath } from './Path';
import EventEmitter from '@utils/EventEmitter';
import Symbol, { type Node as SymbolNode } from './Symbol';
import Scope, { SymbolKey } from './Scope';
import DependencyGraph from './DependencyGraph';
import { Position } from 'vscode-languageserver';
import { isPositionWithinLocationRange, locationToPosition } from './PositionHelper';
import Deprecation from './docBlock/Deprecation';

/** The key is the script URI */
export type ScriptList = Map<string, Script>;

type uri = string | URI | { toString: () => string };

/**
 * Normalizes a file path or URI into a glob-compatible string:
 * backslashes become forward slashes and trailing slashes are removed.
 */
function normalizeGlob(path: string): string {
    return path.replace(/\\/g, '/').replace(/\/+$/, '');
}

export type IncludeResolve = { uri: URI, text: string | null };

export type IncludePromise = Promise<IncludeResolve | null>;

export type AutoIt3Configuration = {
    /** The path to a AutoIt3 installation directory. */
    installDir: string | null,

    /** Directories that should be searched for files when intellisense are resolving #include's in addition to the standard locations */
    userDefinedLibraries: string[],

    /** The target AutoIt3 version for the intellisense. */
    version: string,

    /** Will ignore variables and function declarations in includes, prefixed with \"__\", indicating internal usage */
    ignoreInternalInIncludes: boolean,

    /** When enabled, go to definition shows all matching declarations across scopes and included files. When disabled, only the closest matching declaration is shown. */
    showAllDeclarations: boolean,
};

export class Workspace {
    public readonly eventEmitter = new EventEmitter<{ diagnostics: { uri: string, diagnostics: Diagnostic[] } }>();
    public readonly dependencyGraph = new DependencyGraph();
    protected scripts: ScriptList = new Map();
    protected activeScripts = new Set<string>();
    protected resolvingIncludes = new Map<string, IncludePromise>();
    protected connection: Connection | null;
    protected configuration: AutoIt3Configuration | null = null;
    protected watchedFilesDisposable: Disposable | null = null;
    protected pendingFileEvents = new Map<string, FileChangeType>();
    protected fileEventTimer: ReturnType<typeof setTimeout> | null = null;
    protected readingFiles = new Set<string>();

    public constructor(connection: Connection | null = null) {
        this.connection = connection;

        if (connection !== null) {
            Deprecation.enableWithConnection(connection);
        }

        this.connection?.onInitialized(() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.connection?.workspace.getConfiguration('autoit3').then((configuration: AutoIt3Configuration) => {
                this.configuration = configuration;

                this.registerWatchers(configuration);
            });

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.connection?.client.register(DidChangeConfigurationNotification.type, { section: 'autoit3' });
        });

        this.connection?.onDidChangeWatchedFiles((params) => {
            for (const change of params.changes) {
                this.pendingFileEvents.set(change.uri, change.type);
            }

            if (this.fileEventTimer !== null) {
                return;
            }

            this.fileEventTimer = setTimeout(() => {
                this.fileEventTimer = null;

                void this.processFileEvents();
            }, 200);
        });

        this.connection?.onDidChangeConfiguration((change) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const newConfiguration = change.settings.autoit3 as AutoIt3Configuration | undefined;

            const oldInstallDir = this.configuration?.installDir;
            const oldUserDefinedLibraries = this.configuration?.userDefinedLibraries;

            this.configuration = newConfiguration ?? null;

            const installDirChanged = newConfiguration?.installDir !== oldInstallDir;
            const userDefinedLibrariesChanged = JSON.stringify(newConfiguration?.userDefinedLibraries ?? []) !== JSON.stringify(oldUserDefinedLibraries ?? []);

            if (installDirChanged || userDefinedLibrariesChanged) {
                /*
                 * Include resolution depends on installDir and user defined libraries,
                 * so re-resolve all includes of every script against the new configuration.
                 */
                this.scripts.forEach((script) => {
                    script.refreshIncludes();
                    this.updateDependencies(script);
                });

                // Watched locations outside the workspace depend on the configuration as well
                this.registerWatchers(newConfiguration);
            }
        });

        const script = new Script(native, URI.from({ scheme: 'autoit3doc', path: 'native.au3' }));
        script.addReference();// we falsely increment the reference count here, to make sure it is never released.
        this.add(script);
    }

    public getConnection(): Connection | null {
        return this.connection;
    }

    public add(script: Script): void {
        const uri = script.getUri();

        if (uri === undefined) {
            throw new Error('No URI defined on script object');
        }

        script.workspace = this;
        this.scripts.set(uri.toString(), script);
    }

    public get(uri: uri): Script | undefined {
        return this.scripts.get(uri.toString());
    }

    public exists(uri: uri) {
        return this.scripts.has(uri.toString());
    }

    public createOrUpdate(uri: uri, change: { range: Range, rangeLength?: number, text: string } | { range: Range, rangeLength?: number, text: string }[]): Script | undefined;
    public createOrUpdate(uri: uri, text: string): Script;
    public createOrUpdate(uri: uri, text: { range: Range, rangeLength?: number, text: string }[] | { range: Range, rangeLength?: number, text: string } | string): Script | undefined {
        const _uri = uri.toString();
        let script = this.scripts.get(_uri);

        if (script !== undefined) {
            if (Array.isArray(text)) {
                script.updateAll(text);
            } else {
                script.update(text);
            }
        } else if (typeof text === 'string') {
            script = new Script(text, URI.parse(_uri), this);
            this.add(script);
            script.triggerDiagnostics();
        } else {
            /*
             * An incremental change for a document we have no snapshot of yet cannot be
             * applied, since there is no base text to apply it to. Ignore it and wait
             * for a full text synchronization.
             */
            return undefined;
        }

        /*
         * Collect all include URIs and set dependencies once
         * This ensures old edges are cleaned up via setDependencies
         */
        this.updateDependencies(script);

        return script;
    }

    /**
     * Updates the dependency graph edges for a script based on its currently resolved includes.
     * Fire-and-forget: edges are set once all include promises have settled.
     */
    public updateDependencies(script: Script): void {
        const scriptUri = script.getUri();

        if (scriptUri === undefined) {
            return;
        }

        const uri = scriptUri.toString();

        // Capture the current includes array, so we can detect if it is replaced while resolving
        const includes = script.getIncludes();

        const includeUris = Promise.all(
            includes.map((include) => include.promise),
        );

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        includeUris.then((resolvedUris) => {
            /*
             * If the script's includes have been replaced while resolving (e.g. by
             * refreshIncludes() after a configuration change), a newer updateDependencies
             * call owns the dependency edges, and these results are stale.
             */
            if (script.getIncludes() !== includes) {
                return;
            }

            const dependencies: string[] = [
                URI.from({
                    scheme: 'autoit3doc',
                    path: 'native.au3',
                }).toString(),
            ];

            for (const resolvedUri of resolvedUris) {
                if (resolvedUri !== null) {
                    dependencies.push(resolvedUri);
                }
            }

            this.dependencyGraph.setDependencies(uri, dependencies);
        });
    }

    /**
     * Marks a document as open (or closed) in the editor, so file watcher events
     * for it can be ignored (text synchronization owns open documents).
     */
    public setScriptActive(uri: uri, active: boolean): void {
        if (active) {
            this.activeScripts.add(uri.toString());
        } else {
            this.activeScripts.delete(uri.toString());
        }
    }

    /**
     * Handles a file deletion: removes the script and its dependency graph edges,
     * clears its diagnostics, and re-resolves the includes of dependent scripts.
     */
    public handleFileDeleted(uri: string): void {
        const dependents = this.dependencyGraph.getDirectDependents(uri);

        this.dependencyGraph.removeScript(uri);
        this.scripts.delete(uri);
        this.activeScripts.delete(uri);

        this.eventEmitter.emit('diagnostics', { uri: uri, diagnostics: [] });

        for (const dependentUri of dependents) {
            const dependent = this.scripts.get(dependentUri);

            if (dependent !== undefined) {
                dependent.refreshIncludes();
                this.updateDependencies(dependent);
            }
        }
    }

    /**
     * Handles a file creation or change outside the editor: re-reads the file
     * from disk and updates (or creates) its script. Open documents are skipped,
     * since text synchronization owns them.
     */
    public handleFileChangedOrCreated(uri: string): void {
        if (this.activeScripts.has(uri)) {
            return;
        }

        this.readFileIntoWorkspace(URI.parse(uri));
    }

    public remove(uri: uri): void {
        this.scripts.delete(uri.toString());
    }

    /**
     * Get first declaration statement for matching identifier
     * @param uri file uri
     * @param identifier identifier to match declarator
     * @param includes if includes should be searched as well.
     */
    /*
     *getIdentifierDeclarator(uri: string, identifier: Identifier|VariableIdentifier|Macro|null): FunctionDeclaration|VariableDeclaration|null {
     *  if (identifier?.type === "Macro") {
     *      return null;
     *  }
     *  //return this._getIdentifierDeclarator(uri, identifier) ?? (includes ? this.getIdentifierDeclaratorFromIncludes(uri, identifier) : null);
     *  return includes ? this.getIdentifierDeclaratorFromIncludes(uri, identifier) : this._getIdentifierDeclarator(uri, identifier);
     *}
     */

    public resolveInclude(
        include: AutoIt3.IncludeStatement,
    ): Promise<IncludeResolve | null> {
        const promise = this.connection?.workspace.getConfiguration('autoit3').then((configuration: AutoIt3Configuration) => {
            let promise: IncludePromise = Promise.resolve(null);

            const fileUri = include.file.replace(/\\/g, '/');

            promise = include.library
                ? this.includeLibrary(fileUri, promise, configuration)
                : this.includeLocal(fileUri, include.location.source, promise);

            promise = this.includeUserDefined(fileUri, promise, configuration);

            promise = !include.library
                ? this.includeLibrary(fileUri, promise, configuration)
                : this.includeLocal(fileUri, include.location.source, promise);

            return promise;
        }) ?? Promise.resolve(null);

        /*
         * //FIXME: check if this is needed in Workspace class (from FileAstMap)
         *promise = promise.then(x => {
         *    if (x !== null) {
         *        if (this.exists(x.uri.toString())) {
         *            this.maps[x.uri.toString()].counter++;
         *        } else {
         *            this.add(x.uri.toString(), this.parse(x.text, x.uri.toString()));
         *        }
         *    }
         *    return x;
         *});
         */

        return promise;
    }

    public getConfiguration(): AutoIt3Configuration | null {
        return this.configuration;
    }

    public openScript(uri: string, text: string) {
        this.createOrUpdate(uri, text);
        this.activeScripts.add(uri);
    }

    public updateScript(uri: string, text: string) {
        this.createOrUpdate(uri, text);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public saveScript(uri: string, text: string) {
        //
    }

    public closeScript(uri: string) {
        this.activeScripts.delete(uri);
    }

    public getScopes(uri: string, position?: Position) {
        const scopes: Scope[] = [];

        let scope: Scope | undefined = this.scripts.get(uri)?.getScope();

        if (scope === undefined) {
            return scopes;
        }

        scopes.push(scope);

        // If position is provided, include subscopes that contain the position
        if (position !== undefined) {
            this.collectSubscopesAtPosition(scope, position, scopes);
        }

        for (const dependency of this.dependencyGraph.resolveDependencies(uri)) {
            scope = this.scripts.get(dependency)?.getScope();

            if (scope !== undefined) {
                scopes.push(scope);
            }
        }

        return scopes;
    }

    public getSymbol(uri: string, symbolKey: SymbolKey, position?: Position) {
        const symbol: Symbol = new Symbol(symbolKey);

        let scriptSymbol: Symbol | undefined;

        for (const scope of this.getScopes(uri, position)) {
            scriptSymbol = scope.getSymbol(symbolKey);

            if (scriptSymbol === undefined) {
                continue;
            }

            symbol.addSymbol(scriptSymbol);
        }

        return symbol;
    }

    /**
     * Get declarations for a symbol only from the scope where the position is located.
     * Walks up the scope chain from the innermost scope to find the first scope
     * that has a declaration for the symbol.
     */
    public getDeclarationsAtPosition(uri: string, symbolKey: SymbolKey, position: Position) {
        const script = this.scripts.get(uri);

        if (script === undefined) {
            return [];
        }

        // Find the innermost scope containing the position
        const scope = script.getScopeAtPosition(position);

        // Walk up the scope chain to find the symbol with declarations
        const result = scope.getSymbolInScopeChain(symbolKey);

        if (result === undefined) {
            return [];
        }

        return [...result.symbol.getDeclarations()];
    }

    /**
     * Get the symbol for a given node, merging across scripts for global scopes.
     * For local scopes, the symbol is returned as-is.
     * For global scopes, a new symbol is created and merged with all matching
     * global symbols from the script's dependencies and reverse dependencies.
     */
    public resolveSymbolForNode(node: SymbolNode, symbolKey: SymbolKey): Symbol | undefined {
        const scriptUri = node.location.source.toString();
        const script = this.scripts.get(scriptUri);

        if (script === undefined) {
            return undefined;
        }

        /*
         * For Identifiers and SyntheticIdentifiers (function names from Call),
         * always use the global scope since function declarations are global
         * and the position may fall within a function scope incorrectly
         */
        const scope = node.type === 'Identifier' || node.type === 'SyntheticIdentifier'
            ? script.getScope()
            : script.getScopeAtPosition(locationToPosition(node.location.start));

        const symbol = scope.getSymbol(symbolKey);

        if (symbol === undefined) {
            return undefined;
        }

        // For local scopes, simply return the symbol as-is
        if (!scope.isGlobal()) {
            return symbol;
        }

        /*
         * For global scopes, merge all matching global symbols
         * from dependencies and reverse dependencies
         */
        const mergedSymbol = new Symbol(symbolKey);

        mergedSymbol.addSymbol(symbol);

        for (const depUri of this.dependencyGraph.resolveDependencies(scriptUri)) {
            const depSymbol = this.scripts.get(depUri)
                ?.getScope()
                .getSymbol(symbolKey);

            if (depSymbol !== undefined) {
                mergedSymbol.addSymbol(depSymbol);
            }
        }

        for (const revDepUri of this.dependencyGraph.resolveReverseDependencies(scriptUri)) {
            const revDepSymbol = this.scripts.get(revDepUri)
                ?.getScope()
                .getSymbol(symbolKey);

            if (revDepSymbol !== undefined) {
                mergedSymbol.addSymbol(revDepSymbol);
            }
        }

        return mergedSymbol;
    }

    protected includeLibrary(
        uri: string,
        promise: IncludePromise,
        configuration: AutoIt3Configuration | null,
    ): IncludePromise {
        return promise.then((includeResolve) => (includeResolve === null && typeof configuration?.installDir === 'string' ? this.openTextDocument(Utils.resolvePath(URI.file(configuration.installDir), 'Include', uri)) : includeResolve));
    }

    protected includeUserDefined(
        uri: string,
        promise: IncludePromise,
        configuration: AutoIt3Configuration | null,
    ): IncludePromise {
        for (const path of configuration?.userDefinedLibraries ?? []) {
            promise = promise.then((includeResolve) => includeResolve ?? this.openTextDocument(Utils.resolvePath(URI.file(path), uri)));
        }

        return promise;
    }

    protected includeLocal(
        uri: string,
        documentUri: GrammarSource,
        promise: IncludePromise,
    ): IncludePromise {
        // If document uri starts with 'untitled:', it is not yet saved to disk
        const isUntitled = documentUri.toString().startsWith('untitled:');

        // HACK: currently i check if the documentUri startsWith 'untitled:' to detect files not yet saved to disk. I cannot find a better solution so far...
        return promise.then((includeResolve) => (
            includeResolve === null && !isUntitled
                ? this.openTextDocument(isAbsolutePath(uri)
                    ? URI.file(uri)
                    : Utils.resolvePath(
                        Utils.dirname(URI.parse(documentUri.toString())),
                        uri,
                    ))
                : includeResolve
        ));
    }

    protected openTextDocument(uri: URI): IncludePromise {
        if (uri.scheme !== 'file') {
            return Promise.resolve(null);
        }

        if (this.exists(uri)) {
            return Promise.resolve({ uri: uri, text: null });
        }

        const resolvingInclude = this.resolvingIncludes.get(uri.toString());

        if (resolvingInclude !== undefined) {
            return resolvingInclude;
        }

        const promise = this.connection?.sendRequest<string | null>('fs/readFile', uri.toString()).then<IncludeResolve | null>((resolve) => (resolve === null ? resolve : { uri: uri, text: resolve }))
            .catch((error: unknown) => {
                this.connection?.window.showErrorMessage(`AutoIt3: failed to read include "${uri.toString()}": ${error instanceof Error ? error.message : String(error)}`);

                return null;
            }) ?? Promise.resolve(null);

        this.resolvingIncludes.set(uri.toString(), promise);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        promise.then((value) => {
            if (value !== null && value.text !== null) {
                this.createOrUpdate(value.uri, value.text);
            }

            this.resolvingIncludes.delete(uri.toString());
        });

        return promise;
    }

    /**
     * Recursively collect subscopes that contain the given position.
     * This ensures function parameters and local variables are found
     * when looking up symbols within a function body.
     */
    protected collectSubscopesAtPosition(scope: Scope, position: Position, scopes: Scope[]): void {
        for (const subscope of scope.getSubscopes()) {
            if (subscope.range !== undefined && isPositionWithinLocationRange(position, subscope.range)) {
                scopes.push(subscope);

                // Recurse into nested scopes (e.g., nested functions if supported)
                this.collectSubscopesAtPosition(subscope, position, scopes);
            }
        }
    }

    /**
     * (Re-)registers the file watchers: everything in the workspace folders, the
     * AutoIt3 installation include directory, and the user defined library directories.
     */
    protected registerWatchers(configuration: AutoIt3Configuration | null | undefined): void {
        if (this.connection === null || configuration === null || configuration === undefined) {
            return;
        }

        this.watchedFilesDisposable?.dispose();
        this.watchedFilesDisposable = null;

        const watchers = this.buildWatchers(configuration);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.connection.client.register(DidChangeWatchedFilesNotification.type, { watchers: watchers }).then((disposable) => {
            this.watchedFilesDisposable = disposable;
        });
    }

    /**
     * Builds the watcher list: everything in the workspace, plus the AutoIt3
     * installation include directory and user defined library directories.
     */
    protected buildWatchers(configuration: AutoIt3Configuration): FileSystemWatcher[] {
        const watchers: FileSystemWatcher[] = [{ globPattern: '**/*' }];
        const outsideWorkspaceRoots: string[] = [];

        if (typeof configuration.installDir === 'string') {
            outsideWorkspaceRoots.push(`${normalizeGlob(configuration.installDir)}/Include/**/*`);
        }

        for (const library of configuration.userDefinedLibraries) {
            outsideWorkspaceRoots.push(`${normalizeGlob(library)}/**/*`);
        }

        for (const root of outsideWorkspaceRoots) {
            watchers.push({ globPattern: root });
        }

        return watchers;
    }

    /**
     * Whether the given URI is inside a location the language server manages:
     * a workspace folder, the AutoIt3 installation include directory, or a
     * user defined library directory.
     */
    protected async isManagedUri(uri: string): Promise<boolean> {
        if (this.exists(uri)) {
            return true;
        }

        const configuration = this.configuration;

        const roots: string[] = [];

        if (this.connection !== null) {
            const folders = await this.connection.workspace.getWorkspaceFolders() ?? [];

            for (const folder of folders) {
                roots.push(normalizeGlob(folder.uri));
            }
        }

        const installDir = configuration?.installDir;

        if (typeof installDir === 'string') {
            roots.push(normalizeGlob(`${normalizeGlob(installDir)}/Include`));
        }

        for (const library of configuration?.userDefinedLibraries ?? []) {
            roots.push(normalizeGlob(library));
        }

        return roots.some((root) => uri.startsWith(root));
    }

    /**
     * Processes debounced file watcher events.
     */
    protected async processFileEvents(): Promise<void> {
        const events = [...this.pendingFileEvents.entries()];

        this.pendingFileEvents.clear();

        for (const [uri, type] of events) {
            const managed = await this.isManagedUri(uri);

            if (!managed) {
                continue;
            }

            if (type === FileChangeType.Deleted) {
                this.handleFileDeleted(uri);
            } else {
                this.handleFileChangedOrCreated(uri);
            }
        }
    }

    /**
     * Reads a file from disk via the client and updates (or creates) its script.
     */
    protected readFileIntoWorkspace(uri: URI): void {
        const uriString = uri.toString();

        if (this.readingFiles.has(uriString)) {
            return;
        }

        this.readingFiles.add(uriString);

        const promise = this.connection?.sendRequest<string | null>('fs/readFile', uriString).then<string | null>((text) => text)
            .catch((error: unknown) => {
                this.connection?.window.showErrorMessage(`AutoIt3: failed to read file "${uriString}": ${error instanceof Error ? error.message : String(error)}`);

                return null;
            }) ?? Promise.resolve(null);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        promise.then((text) => {
            this.readingFiles.delete(uriString);

            if (text === null) {
                return;
            }

            this.createOrUpdate(uri, text);
        });
    }
}
