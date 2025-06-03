import { type AutoIt3, type GrammarSource } from 'autoit3-pegjs';
import { Connection, Diagnostic, DidChangeConfigurationNotification } from 'vscode-languageserver';
import { URI, Utils } from 'vscode-uri';
import Script from './Script';
import native from './native.au3?raw';
import { isAbsolutePath } from './Path';

/** The key is the script URI */
export type ScriptList = Map<string, Script>;

type uri = string | URI | { toString: () => string };

export type diagnosticsListner = (
    uri: string, diagnostics: Diagnostic[]) => void;

export type IncludeResolve = { uri: URI, text: string };

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
    protected connection: Connection | null;
    protected diagnosticsListners: diagnosticsListner[] = [];
    protected configuration: AutoIt3Configuration | null = null;

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

    public onDiagnostics(fn: diagnosticsListner): void {
        this.diagnosticsListners.push(fn);
    }

    /**
     * function for removing a diagnostics listner
     */
    public offDiagnostics(fn: diagnosticsListner): void {
        this.diagnosticsListners = this.diagnosticsListners.filter(
            (x) => x !== fn,
        );
    }

    public triggerDiagnostics(uri: string, diagnostics: Diagnostic[]): void {
        for (const fn of this.diagnosticsListners) {
            fn.call(this, uri, diagnostics);
        }
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

            return script;
        }

        script = new Script(text, URI.parse(_uri), this);
        this.add(script);
        script.triggerDiagnostics();

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

        const promise = this.connection?.sendRequest<string | null>('openTextDocument', uri.toString()).then<IncludeResolve | null>((x) => (x === null ? x : { uri: uri, text: x })) ?? Promise.resolve(null);

        promise.then((value) => {
            if (value !== null) {
                this.createOrUpdate(value.uri, value.text);
            }
        });

        return promise;
    }

    public getConfiguration(): AutoIt3Configuration | null {
        return this.configuration;
    }
}
