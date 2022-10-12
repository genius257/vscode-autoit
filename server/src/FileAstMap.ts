import { URI, Utils } from 'vscode-uri';
import parser, { AutoItParser, FunctionDeclaration, IncludeFileNameLiteral, Program, VariableDeclaration, VariableStatement } from "autoit3-pegjs";

export type FileRef = {
    uri: string,
    /** Indicates include-once */
    once: boolean,
}

export type Includes = {
    global: FileRef[],
    scopes: {
        [scope: string]: FileRef[],
    },
}

//export type Identifier = VariableDeclaration|VariableStatement|FunctionDeclaration;
export type Identifier = VariableDeclaration|FunctionDeclaration;

export type Identifiers = {
    global: {[name: string]: Identifier},
    scopes: {[scope: string]: {[name: string]: Identifier}}
}

export type Maps = {
    [uri: string]: {
        data: Program,
        /** reference counter */
        counter: number,
        //includes: string[],
        includes: Includes,
        identifiers: Identifiers,
        scopes: {[scope: string]: FunctionDeclaration}
    };
}

export default class FileAstMap {
    protected maps: Maps = {};
    protected parser: AutoItParser;

    constructor() {
        this.parser = parser;
    }

    parse(input: string, uri?: string): Program {
        return this.parser.parse(input, {grammarSource: uri});
    }

    exists(uri: string): boolean {
        return this.maps.hasOwnProperty(uri);
    }

    add(uri: string, data: Program): void {
        if (this.exists(uri)) {
            this.maps[uri].counter += 1;
            // update the data
            this.maps[uri].data = data;
        } else {
            this.maps[uri] = {
                data: data,
                counter: 1,
                includes: {
                    global: [],
                    scopes: {},
                },
                identifiers: {
                    global: {},
                    scopes: {},
                },
                scopes: {},
            };
        }

        data.body?.forEach(item => {
            switch (item.type) {
                case "FunctionDeclaration":
                    this.maps[uri].identifiers.global[item.id.name.toLowerCase()] = item;
                    break;
                case "VariableDeclaration":
                    item.declarations.forEach(declaration => {
                        this.maps[uri].identifiers.global['$' + declaration.id.name.toLowerCase()] = declaration;
                    });
                    break;
                default:
                    break;
            }
        });

        //this.addIncludes(uri);
    }

    addIncludes(uri: string) {
        const previousIncludes = this.maps[uri].includes.global.map(fileRef => fileRef.uri); //FIXME
        const includes = this.maps[uri].data.body.filter((node): node is {
            type: "IncludeStatement",
            file: IncludeFileNameLiteral,
            location: any,
        } => node.type === "IncludeStatement").map((includeUri) => this.resolveIncludePath(uri, includeUri.file)) ?? [];

        this.difference(previousIncludes, includes).forEach(previousInclude => this.release(previousInclude));
        this.difference(includes, previousIncludes).forEach(include => {
            this.addInclude(include);
        });

        this.maps[uri].includes.global = includes.map(uri => ({uri: uri, once: false})); //FIXME
    }

    addInclude(uri) {
        if (this.exists(uri)) {
            this.maps[uri].counter++;
            return;
        }

        //FIXME: use vs file api to read files.
        //this.add(uri, this.parser(fs ))
    }

    resolveIncludePath(textDocumentUri: string, includeStatementUri: string): string {
        //FIXME: currently we only resolve the include uri's as "Script directory" includes. Implementation need for "User-defined libraries" and "Standard library".
        // An extra parameter indicating starting from script or standard library when looking for the file is needed.
        // This may hovever not be needed in the webworker version?
        return Utils.resolvePath(Utils.dirname(URI.parse(textDocumentUri)), includeStatementUri).toString();
    }

    difference(arr1: any[], arr2: any[]): any[] {
        return arr1.filter(x => !arr2.includes(x));
    }

    release(uri: string): void {
        if (this.exists(uri)) {
            if (--this.maps[uri].counter <= 0) {
                delete this.maps[uri];
            }
        }
    }

    get(uri: string): Program {
        if (!this.exists(uri)) {
            throw new Error(`URI not found in map: ${uri}`);
        }
        return this.maps[uri].data;
    }

    /** Get first declaration statement for matching identifier */
    getIdentifierDeclarator(uri: string, identifier: Identifier): FunctionDeclaration|VariableDeclaration|null {
        if (!this.exists(uri)) {
            throw new Error(`URI not found in map: ${uri}`);
        }
        //const scope = this.getScopeAt(uri, identifier.location.start.line, identifier.location.start.line); //FIXME: scope support

        const identifiers = this.maps[uri].identifiers.global;
        const _identifier = Object.keys(identifiers ?? {}).find(identifierIndex => {
            const _identifier = identifiers[identifierIndex];
            return _identifier.id === identifier.id;
        })

        return _identifier !== undefined ? identifiers[_identifier] : null;
    }

    /** get identifier object based on cursor position */
    getIdentifierAt(uri: string, line: number, column: number): Identifier|null {
        if (!this.exists(uri)) {
            throw new Error(`URI not found in map: ${uri}`);
        }
        //FIXME: object properties with dot notation support.
        const scope = this.getScopeAt(uri, line, column); //FIXME: iterate document includes, until match is found?
        const scopeIdentifiers = this.maps[uri].identifiers.scopes[scope?.id.name ?? ""];
        const scopeIdentifier = Object.keys(scopeIdentifiers ?? {}).find(scopeIdentifier => {
            const _scopeIdentifier = scopeIdentifiers[scopeIdentifier] as {location?: {start: {line: number, column: number}, end: {line: number, column: number}}};
            if (_scopeIdentifier !== undefined && _scopeIdentifier.location !== undefined) {
                if (_scopeIdentifier.location.start.line <= line && _scopeIdentifier.location.end.line >= line) {
                    if (_scopeIdentifier.location.start.column <= column && _scopeIdentifier.location.end.column >= column) {
                        return true;
                    }
                }
            }
        });

        if (scopeIdentifier !== undefined) {
            return scopeIdentifiers[scopeIdentifier] ?? null;
        }

        const identifiers = this.maps[uri].identifiers.global;
        const identifier = Object.keys(identifiers ?? {}).find(identifier => {
            const _identifier = identifiers[identifier];
            if (_identifier !== undefined && _identifier.location !== undefined) {
                if (_identifier.location.start.line <= line && _identifier.location.end.line >= line) {
                    if (_identifier.location.start.column <= column && _identifier.location.end.column >= column) {
                        return true;
                    }
                }
            }
        })
        return identifier !== undefined ? identifiers[identifier] : null;
    }

    /** get scope id based on cursor position */
    getScopeAt(uri: string, line: number, column: number) {
        if (!this.exists(uri)) {
            throw new Error(`URI not found in map: ${uri}`);
        }

        const map = this.maps[uri];
        const scopes = map.scopes;
        const scope = Object.keys(scopes).find(scope => {
            const _scope = scopes[scope] as {location?: {start: {line: number, column: number}, end: {line: number, column: number}}};
            if (_scope !== undefined && _scope.location !== undefined) {
                if (_scope.location.start.line <= line && _scope.location.end.line >= line) {
                    if (_scope.location.start.column <= column && _scope.location.end.column >= column) {
                        return true;
                    }
                }
            }
        });

        return scope !== undefined ? scopes[scope] : null;
    }
}

export class AutoIt {
    //
}
