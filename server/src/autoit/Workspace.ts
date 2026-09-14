import { type AutoIt3, type GrammarSource } from 'autoit3-pegjs';
import { Connection, Diagnostic, DidChangeConfigurationNotification, DidChangeWatchedFilesNotification, Disposable, FileChangeType, type FileSystemWatcher, ProtocolNotificationType, type RelativePattern, Range, type TextEdit, type WorkDoneProgressServerReporter } from 'vscode-languageserver';
import { URI, Utils } from 'vscode-uri';
import Script from './Script';
import native from './native.au3?raw';
import { isAbsolutePath, relativePath } from './Path';
import EventEmitter from '@utils/EventEmitter';
import Symbol, { type Node as SymbolNode } from './Symbol';
import Scope, { SymbolKey } from './Scope';
import DependencyGraph from './DependencyGraph';
import { Position } from 'vscode-languageserver';
import { isPositionWithinLocationRange, isLocationBeforeOrEqual, locationToPosition } from './PositionHelper';
import Deprecation from './docBlock/Deprecation';

/** The key is the script URI */
export type ScriptList = Map<string, Script>;

type uri = string | URI | { toString: () => string };

/**
 * A symbol declared in the global scope of a file-backed script in the workspace.
 */
export type WorkspaceSymbolEntry = {
    /** Lowercase symbol key, matching `Symbol.name` and scope symbol keys */
    key: string,
    symbol: Symbol,
    uri: URI,
};

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

    /**
     * When enabled, completion suggestions include functions and global variables
     * from all workspace files, even when not included. Accepting such a suggestion
     * inserts the required #include after the last top-level include.
     */
    workspaceCompletions?: boolean,
};

export type IndexingProgress = { loaded: number, total: number };

export const IndexingProgressNotification = new ProtocolNotificationType<IndexingProgress, void>('autoit3/indexingProgress');

/** Maximum number of concurrent file reads during startup preloading. */
const preloadConcurrency = 8;

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
    protected fileEventRevisions = new Map<string, number>();
    protected workspaceSymbolIndex: WorkspaceSymbolEntry[] | null = null;

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

                void this.preloadWorkspace(configuration);
            });

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.connection?.client.register(DidChangeConfigurationNotification.type, { section: 'autoit3' });
        });

        this.connection?.onDidChangeWatchedFiles((params) => {
            for (const change of params.changes) {
                this.pendingFileEvents.set(change.uri, change.type);

                // Monotonically increasing revision per URI, so stale read completions can be detected
                this.fileEventRevisions.set(change.uri, (this.fileEventRevisions.get(change.uri) ?? 0) + 1);
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
        this.workspaceSymbolIndex = null;
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

        this.workspaceSymbolIndex = null;

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
        // Open documents are owned by text synchronization; deletion of the underlying file must not affect them
        if (this.activeScripts.has(uri)) {
            return;
        }

        const dependents = this.dependencyGraph.getDirectDependents(uri);

        this.dependencyGraph.removeScript(uri);
        this.scripts.delete(uri);
        this.workspaceSymbolIndex = null;

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
        this.workspaceSymbolIndex = null;
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

    /**
     * Returns symbols declared (or assigned) in the global scope of every
     * file-backed script in the workspace: functions and global variables.
     * The native library and non-file URIs are excluded. Only the first
     * script declaring a given symbol name is kept. The index is cached and
     * rebuilt lazily after any script change.
     */
    public getWorkspaceSymbols(): WorkspaceSymbolEntry[] {
        if (this.workspaceSymbolIndex === null) {
            const entries: WorkspaceSymbolEntry[] = [];
            const seenKeys = new Set<string>();

            for (const [uriString] of this.scripts) {
                const uri = URI.parse(uriString);

                if (uri.scheme !== 'file') {
                    continue;
                }

                const script = this.scripts.get(uriString);

                if (script === undefined) {
                    continue;
                }

                for (const symbolPair of script.getScope().getSymbols()) {
                    const [, scopeSymbol] = symbolPair;

                    // Skip symbols that are only referenced, not declared or assigned
                    if (scopeSymbol.getDeclarations().size === 0 && scopeSymbol.getAssignments().size === 0) {
                        continue;
                    }

                    if (seenKeys.has(scopeSymbol.name)) {
                        continue;
                    }

                    seenKeys.add(scopeSymbol.name);
                    entries.push({ key: scopeSymbol.name, symbol: scopeSymbol, uri });
                }
            }

            entries.sort((a, b) => a.uri.toString().localeCompare(b.uri.toString()) || a.key.localeCompare(b.key));

            this.workspaceSymbolIndex = entries;
        }

        return this.workspaceSymbolIndex;
    }

    /**
     * Computes the `#include` insertion edit that makes a declaration from
     * `targetUri` available in the script at `scriptUri`. The include path is
     * resolved as a standard library / user defined library include when the
     * target is contained in one of those roots, and as a script-relative path
     * otherwise. The statement is inserted on the line after the last top-level
     * include statement, or at the very top of the file when none exist.
     */
    public getIncludeInsertionEdit(scriptUri: string, targetUri: string): TextEdit | null {
        const script = this.scripts.get(scriptUri);

        if (script === undefined) {
            return null;
        }

        const scriptFile = script.getUri();
        const target = URI.parse(targetUri);

        if (scriptFile === undefined || target.toString() === scriptFile.toString()) {
            return null;
        }

        const includePath = this.resolveIncludePathForEdit(scriptFile, target);

        if (includePath === null) {
            return null;
        }

        const includes = script.getIncludes();

        let insertPosition: Position = { line: 0, character: 0 };

        if (includes.length > 0) {
            const last = includes.reduce((a, b) => (isLocationBeforeOrEqual(a.statement.location.end, b.statement.location.end) ? b : a));

            insertPosition = {
                line: last.statement.location.end.line,
                character: 0,
            };
        }

        return {
            range: { start: insertPosition, end: insertPosition },
            newText: `#include ${includePath}\n`,
        };
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

    /**
     * Resolves the include path text for a target file, relative to the managed
     * roots, or returns null when the target cannot be included.
     */
    protected resolveIncludePathForEdit(scriptUri: URI, targetUri: URI): string | null {
        if (targetUri.scheme !== 'file' || scriptUri.scheme !== 'file') {
            return null;
        }

        const configuration = this.configuration;
        const targetPath = targetUri.path.replace(/\/+$/, '');

        const containedIn = (rootPath: string): string | null => {
            const rootFilePath = URI.file(rootPath.replace(/\\/g, '/').replace(/\/+$/, '')).path.replace(/\/+$/, '');
            const lowerTarget = targetPath.toLowerCase();
            const lowerRoot = rootFilePath.toLowerCase();

            if (lowerTarget === lowerRoot || lowerTarget.startsWith(`${lowerRoot}/`)) {
                return targetPath.slice(rootFilePath.length).replace(/^\//, '');
            }

            return null;
        };

        // Standard library include: <relative\path.au3>
        if (typeof configuration?.installDir === 'string') {
            const relative = containedIn(`${normalizeGlob(configuration.installDir)}/Include`);

            if (relative !== null) {
                return `<${relative.replace(/\//g, '\\')}>`;
            }
        }

        // User defined library include: <relative\path.au3>
        for (const library of configuration?.userDefinedLibraries ?? []) {
            const relative = containedIn(normalizeGlob(library));

            if (relative !== null) {
                return `<${relative.replace(/\//g, '\\')}>`;
            }
        }

        // Local include relative to the script directory: "relative\path.au3"
        const relative = relativePath(Utils.dirname(scriptUri).path, targetUri.path);

        return `"${relative.replace(/\//g, '\\')}"`;
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
     * Roots outside the workspace are registered as RelativePattern instances
     * based on file URIs.
     */
    protected buildWatchers(configuration: AutoIt3Configuration): FileSystemWatcher[] {
        const watchers: FileSystemWatcher[] = [{ globPattern: '**/*' }];

        if (typeof configuration.installDir === 'string') {
            const includeUri = URI.file(`${normalizeGlob(configuration.installDir)}/Include`);

            watchers.push({ globPattern: this.createRootRelativePattern(includeUri) });
        }

        for (const library of configuration.userDefinedLibraries) {
            watchers.push({ globPattern: this.createRootRelativePattern(URI.file(normalizeGlob(library))) });
        }

        return watchers;
    }

    /**
     * Creates a RelativePattern watching everything below the given root URI.
     */
    protected createRootRelativePattern(rootUri: URI): RelativePattern {
        return {
            baseUri: rootUri.toString(),
            pattern: '**/*',
        };
    }

    /**
     * Whether the given URI is inside a location the language server manages:
     * a workspace folder, the AutoIt3 installation include directory, or a
     * user defined library directory. Containment is matched on URI paths with
     * path-boundary semantics, so sibling paths are not treated as contained.
     */
    protected async isManagedUri(uri: string): Promise<boolean> {
        if (this.exists(uri)) {
            return true;
        }

        const configuration = this.configuration;

        const rootUris: URI[] = [];

        if (this.connection !== null) {
            const folders = await this.connection.workspace.getWorkspaceFolders() ?? [];

            for (const folder of folders) {
                rootUris.push(URI.parse(folder.uri));
            }
        }

        const installDir = configuration?.installDir;

        if (typeof installDir === 'string') {
            rootUris.push(URI.file(`${normalizeGlob(installDir)}/Include`));
        }

        for (const library of configuration?.userDefinedLibraries ?? []) {
            rootUris.push(URI.file(normalizeGlob(library)));
        }

        const uriPath = URI.parse(uri).path;

        return rootUris.some((rootUri) => {
            const rootPath = rootUri.path.replace(/\/+$/, '');

            // Case-insensitive comparison for file URIs, since e.g. Windows drive paths may differ in case between configuration and watcher events
            if (rootUri.scheme === 'file' && URI.parse(uri).scheme === 'file') {
                return uriPath.toLowerCase() === rootPath.toLowerCase() || uriPath.toLowerCase().startsWith(`${rootPath.toLowerCase()}/`);
            }

            return uriPath === rootPath || uriPath.startsWith(`${rootPath}/`);
        });
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
    protected readFileIntoWorkspace(uri: URI, onSettled?: () => void): void {
        const uriString = uri.toString();

        if (this.readingFiles.has(uriString)) {
            return;
        }

        this.readingFiles.add(uriString);

        const revision = this.fileEventRevisions.get(uriString) ?? 0;

        const promise = this.connection?.sendRequest<string | null>('fs/readFile', uriString).then<string | null>((text) => text)
            .catch((error: unknown) => {
                this.connection?.window.showErrorMessage(`AutoIt3: failed to read file "${uriString}": ${error instanceof Error ? error.message : String(error)}`);

                return null;
            }) ?? Promise.resolve(null);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        promise.then((text) => {
            this.readingFiles.delete(uriString);

            onSettled?.();

            if (text === null) {
                return;
            }

            // A newer file event (e.g. a delete) superseded this read, so its result is stale
            if ((this.fileEventRevisions.get(uriString) ?? 0) !== revision) {
                return;
            }

            this.createOrUpdate(uri, text);
        });
    }

    /**
     * Collects the root URIs of all managed locations: workspace folders, the
     * AutoIt3 installation include directory, and user defined library directories.
     */
    protected async getManagedRootUris(configuration: AutoIt3Configuration): Promise<URI[]> {
        const rootUris: URI[] = [];

        if (this.connection !== null) {
            const folders = await this.connection.workspace.getWorkspaceFolders() ?? [];

            for (const folder of folders) {
                rootUris.push(URI.parse(folder.uri));
            }
        }

        const installDir = configuration.installDir;

        if (typeof installDir === 'string') {
            rootUris.push(URI.file(`${normalizeGlob(installDir)}/Include`));
        }

        for (const library of configuration.userDefinedLibraries) {
            rootUris.push(URI.file(normalizeGlob(library)));
        }

        return rootUris;
    }

    /**
     * Loads all AutoIt3 script files in the managed locations on startup, so
     * declarations from includes and other workspace files are available without
     * each file being opened first. Open documents are skipped, since text
     * synchronization owns them.
     */
    protected async preloadWorkspace(configuration: AutoIt3Configuration): Promise<void> {
        const rootUris = await this.getManagedRootUris(configuration);

        const pendingUris = new Set<string>();

        for (const rootUri of rootUris) {
            const uris = await this.connection?.sendRequest<string[]>('fs/listFiles', rootUri.toString()).catch(() => []) ?? [];

            for (const uri of uris) {
                if (this.activeScripts.has(uri) || this.exists(uri) || this.readingFiles.has(uri)) {
                    continue;
                }

                pendingUris.add(uri);
            }
        }

        const total = pendingUris.size;

        const notifyProgress = (loaded: number): void => {
            void this.connection?.sendNotification(IndexingProgressNotification, { loaded, total });
        };

        notifyProgress(0);

        if (total === 0) {
            return;
        }

        const progress = await this.createIndexingProgress();

        let loaded = 0;

        const onSettled = (): void => {
            loaded++;

            notifyProgress(loaded);

            if (progress !== null) {
                progress.report(Math.round(loaded / total * 100), `Loading ${loaded} of ${total} files`);

                if (loaded === total) {
                    progress.done();
                }
            }
        };

        progress?.begin('Indexing AutoIt3 scripts');

        /*
         * Bounded worker pool: keep at most `preloadConcurrency` reads active at a
         * time, starting the next URI only when an active read settles, so a huge
         * workspace does not flood the client with simultaneous fs/readFile requests.
         */
        const urisIterator = pendingUris.values();

        const worker = async (): Promise<void> => {
            for (;;) {
                const next = urisIterator.next();

                if (next.done === true) {
                    return;
                }

                await new Promise<void>((resolve) => {
                    const uriString = URI.parse(next.value).toString();

                    /*
                     * A file event may have started a read of this URI between the
                     * filtering above and now; readFileIntoWorkspace would skip it
                     * without invoking onSettled, so treat it as settled instead.
                     */
                    if (this.readingFiles.has(uriString)) {
                        resolve();

                        return;
                    }

                    this.readFileIntoWorkspace(URI.parse(uriString), () => {
                        onSettled();

                        resolve();
                    });
                });
            }
        };

        await Promise.all(Array.from({ length: Math.min(preloadConcurrency, total) }, () => worker()));
    }

    /**
     * Creates a window work done progress for indexing, or null when the client
     * does not support it (or the creation fails for any other reason).
     */
    protected async createIndexingProgress(): Promise<WorkDoneProgressServerReporter | null> {
        try {
            return await this.connection?.window.createWorkDoneProgress() ?? null;
        } catch {
            return null;
        }
    }
}
