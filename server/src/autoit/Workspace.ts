import { IncludeStatement } from 'autoit3-pegjs';
import { Connection, Diagnostic } from 'vscode-languageserver';
import { URI, Utils } from 'vscode-uri';
import Script from "./Script";
import native from "./native.au3?raw";
import { isAbsolutePath } from './Path';

export type scriptList = {
    [uri: string]: Script | undefined,
}

type uri = string | URI;

export type diagnosticsListner = (uri: string, diagnostics: Array<Diagnostic>) => void;

export type IncludeResolve = {uri: URI, text: string};
export type IncludePromise = Promise<IncludeResolve|null>;

export type AutoIt3Configuration = {
    "installDir": string|null,
    "userDefinedLibraries": string[],
    "version": string,
};

export class Workspace {
    protected scripts: scriptList = {};
    protected connection: Connection|null;

    protected diagnosticsListners: Array<diagnosticsListner> = [];

    constructor(connection: Connection|null = null) {
        this.connection = connection;

        const script = new Script(native, URI.from({scheme: 'autoit3doc', 'path': 'native.au3'}));
        script.addReference();// we falsely increment the reference count here, to make sure it is never released.
        this.add(script);
    }

    public getConnection(): Connection|null {
        return this.connection;
    }

    public onDiagnostics(fn: diagnosticsListner): void {
        this.diagnosticsListners.push(fn);
    }

    public triggerDiagnostics(uri: string, diagnostics: Array<Diagnostic>): void {
        for (const fn of this.diagnosticsListners) {
            fn.call(this, uri, diagnostics);
        }
    }

    public add(script: Script): void {
        const uri = script.getUri();
        if (uri === undefined) {
            throw new Error("No URI defined on script object");
        }
        script.workspace = this;
        this.scripts[uri.toString()] = script;
    }

    public get(uri: uri): Script | undefined {
        return this.scripts[uri.toString()];
    }

    public exists(uri: uri) {
        return uri.toString() in this.scripts;
    }

    public createOrUpdate(uri: uri, text: string): Script {
        uri = uri.toString();
        let script = this.scripts?.[uri];

        if (script !== undefined) {
            script.update(text);
            return script;
        }

        script = new Script(text, URI.parse(uri), this);
        this.add(script);
        script.triggerDiagnostics();
        return script;
    }

    public remove(uri: uri): void {
        delete this.scripts[uri.toString()];
    }

    /**
     * Get first declaration statement for matching identifier
     * @param uri file uri
     * @param identifier identifier to match declarator
     * @param includes if includes should be searched as well.
     */
    /*getIdentifierDeclarator(uri: string, identifier: Identifier|VariableIdentifier|Macro|null): FunctionDeclaration|VariableDeclaration|null {
        if (identifier?.type === "Macro") {
            return null;
        }
        //return this._getIdentifierDeclarator(uri, identifier) ?? (includes ? this.getIdentifierDeclaratorFromIncludes(uri, identifier) : null);
        return includes ? this.getIdentifierDeclaratorFromIncludes(uri, identifier) : this._getIdentifierDeclarator(uri, identifier);
    }*/

    public resolveInclude(include: IncludeStatement): Promise<IncludeResolve | null> {
        let promise = this.connection?.workspace.getConfiguration("autoit3").then((configuration: AutoIt3Configuration) => {
            let promise:IncludePromise = Promise.resolve(null);

            const fileUri = include.file.replace(/\\/g, '/');

            promise = include.library ? this.includeLibrary(fileUri, promise, configuration) : this.includeLocal(fileUri, include.location.source, promise);

            promise = this.includeUserDefined(fileUri, promise, configuration);

            promise = !include.library ? this.includeLibrary(fileUri, promise, configuration) : this.includeLocal(fileUri, include.location.source, promise);

            return promise;
        }) ?? Promise.resolve(null);

        /*
        //FIXME: check if this is needed in Workspace class (from FileAstMap)
        promise = promise.then(x => {
            if (x !== null) {
                if (this.exists(x.uri.toString())) {
                    this.maps[x.uri.toString()].counter++;
                } else {
                    this.add(x.uri.toString(), this.parse(x.text, x.uri.toString()));
                }
            }
            return x;
        });
        */

        return promise;
    }

    protected includeLibrary(uri: string, promise: IncludePromise, configuration: AutoIt3Configuration|null): IncludePromise {
        return promise.then(x => x === null && typeof configuration?.installDir === "string" ? this.openTextDocument(Utils.resolvePath(URI.file(configuration.installDir), 'Include', uri)) : x);
    }

    protected includeUserDefined(uri: string, promise: IncludePromise, configuration: AutoIt3Configuration|null): IncludePromise {
        for (const path of configuration?.userDefinedLibraries ?? []) {
            promise = promise.then(x => x === null ? this.openTextDocument(Utils.resolvePath(URI.file(path), uri)) : x);
        }

        return promise;
    }

    protected includeLocal(uri: string, documentUri: string, promise: IncludePromise): IncludePromise {
        // If document uri starts with 'untitled:', it is not yet saved to disk
        const isUntitled = documentUri.startsWith('untitled:');

        //HACK: currently i check if the documentUri startsWith 'untitled:' to detect files not yet saved to disk. I cannot find a better solution so far...
        return promise.then(x => x === null && !isUntitled ? this.openTextDocument(isAbsolutePath(uri) ? URI.file(uri) : Utils.resolvePath(Utils.dirname(URI.parse(documentUri)), uri)) : x);
    }

    protected openTextDocument(uri: URI): IncludePromise {
        const promise = this.connection?.sendRequest<string|null>("openTextDocument", uri.toString()).then<IncludeResolve|null>(x => x === null ? x : ({uri: uri, text: x})) ?? Promise.resolve(null);

        promise.then(value => {if (value !== null) {this.createOrUpdate(value.uri, value.text);}} );

        return promise;
    }
}
