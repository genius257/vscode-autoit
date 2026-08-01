import { type AutoIt3, type GrammarSource } from 'autoit3-pegjs';
import { Connection, Diagnostic, DidChangeConfigurationNotification } from 'vscode-languageserver';
import { URI, Utils } from 'vscode-uri';
import Script from './Script';
import native from './native.au3?raw';
import { isAbsolutePath } from './Path';
import EventEmitter from '@utils/EventEmitter';
import Symbol from './Symbol';
import Scope, { SymbolKey } from './Scope';
import DependencyGraph from './DependencyGraph';
import { Position } from 'vscode-languageserver';
import { isPositionWithinLocationRange, locationToPosition } from './PositionHelper';

/** The key is the script URI */
export type ScriptList = Map<string, Script>;

type uri = string | URI | { toString: () => string };

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
};

export class Workspace {
    protected scripts: ScriptList = new Map();
    protected activeScripts = new Set<string>();
    protected resolvingIncludes = new Map<string, IncludePromise>();
    protected connection: Connection | null;
    protected configuration: AutoIt3Configuration | null = null;
    public readonly eventEmitter = new EventEmitter<{ diagnostics: { uri: string, diagnostics: Diagnostic[] } }>();
    public readonly dependencyGraph = new DependencyGraph();

    constructor(connection: Connection | null = null) {
        this.connection = connection;

        this.connection?.onInitialized(() => {
            this.connection?.workspace.getConfiguration('autoit3').then((configuration: AutoIt3Configuration) => {
                this.configuration = configuration;
            });
            this.connection?.client.register(DidChangeConfigurationNotification.type, { section: 'autoit3' });
        });
        this.connection?.onDidChangeConfiguration((change) => {
            this.configuration = change.settings.autoit3;
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

    public createOrUpdate(uri: uri, text: string): Script {
        const _uri = uri.toString();
        let script = this.scripts.get(_uri);

        if (script !== undefined) {
            script.update(text);
        } else {
            script = new Script(text, URI.parse(_uri), this);
            this.add(script);
            script.triggerDiagnostics();
        }

        // Collect all include URIs and set dependencies once
        // This ensures old edges are cleaned up via setDependencies
        const includeUris = Promise.all(
            script.getIncludes().map((include) => include.promise),
        );

        includeUris.then((resolvedUris) => {
            const dependencies: string[] = [
                URI.from({ scheme: 'autoit3doc', path: 'native.au3' }).toString(),
            ];

            for (const resolvedUri of resolvedUris) {
                if (resolvedUri !== null) {
                    dependencies.push(resolvedUri);
                }
            }

            this.dependencyGraph.setDependencies(_uri, dependencies);
        });

        return script;
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
            promise = promise.then((includeResolve) => (includeResolve === null
                ? this.openTextDocument(Utils.resolvePath(URI.file(path), uri))
                : includeResolve
            ));
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

        const promise = this.connection?.sendRequest<string | null>('openTextDocument', uri.toString()).then<IncludeResolve | null>((resolve) => (resolve === null ? resolve : { uri: uri, text: resolve })) ?? Promise.resolve(null);

        this.resolvingIncludes.set(uri.toString(), promise);

        promise.then((value) => {
            if (value !== null && value.text !== null) {
                this.createOrUpdate(value.uri, value.text);
            }

            this.resolvingIncludes.delete(uri.toString());
        });

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
    public resolveSymbolForNode(node: AutoIt3.Identifier | AutoIt3.VariableIdentifier | AutoIt3.Macro, symbolKey: SymbolKey): Symbol | undefined {
        const scriptUri = node.location.source.toString();
        const script = this.scripts.get(scriptUri);

        if (script === undefined) {
            return undefined;
        }

        // For Identifiers (function names), always use the global scope
        // since function declarations are global and the position may fall
        // within a function scope incorrectly
        const scope = node.type === 'Identifier'
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

        // For global scopes, merge all matching global symbols
        // from dependencies and reverse dependencies
        const mergedSymbol = new Symbol(symbolKey);

        mergedSymbol.addSymbol(symbol);

        for (const depUri of this.dependencyGraph.resolveDependencies(scriptUri)) {
            const depSymbol = this.scripts.get(depUri)?.getScope()?.getSymbol(symbolKey);

            if (depSymbol !== undefined) {
                mergedSymbol.addSymbol(depSymbol);
            }
        }

        for (const revDepUri of this.dependencyGraph.resolveReverseDependencies(scriptUri)) {
            const revDepSymbol = this.scripts.get(revDepUri)?.getScope()?.getSymbol(symbolKey);

            if (revDepSymbol !== undefined) {
                mergedSymbol.addSymbol(revDepSymbol);
            }
        }

        return mergedSymbol;
    }
}
