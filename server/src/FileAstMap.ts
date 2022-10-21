import { URI, Utils } from 'vscode-uri';
import parser, { ArgumentList, ArrayDeclaration, ArrayDeclarationElementList, AssignmentExpression, AutoItParser, CaseClause, CaseValueList, DefaultClause, FormalParameter, FormalParameterList, FunctionDeclaration, Identifier, IdentifierName, IncludeFileNameLiteral, LocationRange, Program, RedimIdentifierExpression, SelectCaseClause, SourceElement, SourceElements, SwitchCaseValue, VariableDeclaration, VariableDeclarationList, VariableIdentifier, VariableStatement } from "autoit3-pegjs";

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
//export type Identifier = VariableDeclaration|FunctionDeclaration;

export type Identifiers = {
    global: {[name: string]: VariableDeclaration|FunctionDeclaration},
    scopes: {[scope: string]: {[name: string]: VariableDeclaration|FunctionDeclaration}}
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
    protected connection: Connection|null;

    constructor(connection: Connection|null) {
        this.parser = parser;
        this.connection = connection;
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
            // reset meta data
            this.maps[uri].identifiers.global = {};
            this.maps[uri].scopes = {};
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
                    this.maps[uri].scopes[item.id.name.toLowerCase()] = item;
                    break;
                case "VariableDeclaration":
                    item.declarations.forEach(declaration => {
                        const key = '$' + declaration.id.name.toLowerCase();
                        if (!this.maps[uri].identifiers.global.hasOwnProperty(key)) {
                            this.maps[uri].identifiers.global[key] = declaration;
                        }
                    });
                    break;
                default:
                    break;
            }
        });

        this.addIncludes(uri);
    }

    addIncludes(uri: string) {
        const previousIncludes = this.maps[uri].includes.global.map(fileRef => fileRef.uri);
        const includes = this.maps[uri].data.body.filter((node): node is {
            type: "IncludeStatement",
            library: IncludeFileName[0],
            file: IncludeFileName[1],
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
        return Utils.resolvePath(Utils.dirname(URI.parse(textDocumentUri)), includeStatementUri.replace(/\\/g, "/")).toString();
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

    getMap(uri: string) {
        if (!this.exists(uri)) {
            throw new Error(`URI not found in map: ${uri}`);
        }

        return this.maps[uri];
    }

    /**
     * Get first declaration statement for matching identifier
     * @param uri file uri
     * @param identifier identifier to match declarator
     * @param includes if includes should be searched as well.
     */
    getIdentifierDeclarator(uri: string, identifier: Identifier|VariableIdentifier|null, includes: boolean = true): FunctionDeclaration|VariableDeclaration|null {
        //return this._getIdentifierDeclarator(uri, identifier) ?? (includes ? this.getIdentifierDeclaratorFromIncludes(uri, identifier) : null);
        return includes ? this.getIdentifierDeclaratorFromIncludes(uri, identifier) : this._getIdentifierDeclarator(uri, identifier);
    }

    protected _getIdentifierDeclarator(uri: string, identifier: Identifier|VariableIdentifier|null) {
        if (!this.exists(uri)) {
            throw new Error(`URI not found in map: ${uri}`);
        }

        if (identifier === null) {
            return null;
        }

        //const scope = this.getScopeAt(uri, identifier.location.start.line, identifier.location.start.line); //FIXME: scope support

        const identifiers = this.maps[uri].identifiers.global;
        let identifierName = identifier.name;
        if (identifier.type === "VariableIdentifier") {
            identifierName = "$"+identifierName;
        }
        const _identifier = identifiers[identifierName.toLowerCase()];

        return _identifier ?? null;
    }

    getIdentifierDeclaratorFromIncludes(uri: string, identifier: Identifier|VariableIdentifier|null, stack: string[] = []): FunctionDeclaration|VariableDeclaration|null {
        if (stack.indexOf(uri) !== -1) {
            return null;
        }
        stack.push(uri);
        let declarator = this._getIdentifierDeclarator(uri, identifier);
        if (declarator !== null) {
            return declarator;
        }
        try {
            const map = this.getMap(uri);
            for (const include of map.includes.global) {
                try {
                    //declarator = this.getIdentifierDeclaratorFromIncludes(this.resolveIncludePath(uri, include.uri), identifier, stack);
                    declarator = this.getIdentifierDeclaratorFromIncludes(include.uri, identifier, stack);
                    if (declarator !== null) {
                        return declarator;
                    }
                } catch (e) {
                    // do nothing, keep going.
                }
            }
        } catch (e) {
            return null;
        }

        return null;
    }

    /** get identifier object based on cursor position */
    getIdentifierAt(uri: string, line: number, column: number): Identifier|VariableIdentifier|null {
        if (!this.exists(uri)) {
            throw new Error(`URI not found in map: ${uri}`);
        }
        //FIXME: object properties with dot notation support.
        /*
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
            const identifier = scopeIdentifiers[scopeIdentifier] ?? null;
            return identifier.id;
        }
        */

        return this.getNestedIdentifierAtFromArray(this.maps[uri].data.body, line, column);
    }

    getNestedIdentifierAt(node: SourceElement|AssignmentExpression|FormalParameter|VariableDeclaration|ArrayDeclaration|DefaultClause|CaseClause|SelectCaseClause|SwitchCaseValue|null, line: number, column: number): VariableIdentifier|Identifier|null {//FunctionDeclaration|VariableDeclaration|Identifier|IdentifierName|VariableIdentifier|null {
        if (node === null) {
            return null;
        }
        if (node.location === undefined) {
            throw new Error("location is undefined on node type: "+node.type);
        }
        //MemberExpression order is reversed, so location of top object is the last part of the MemberExpression(s)
        if (node.type !== "MemberExpression" && !this.isPositionWithinLocation(line, column, node.location)) {
            return null;
        }
        switch (node.type) {
            case "ArrayDeclaration":
                return this.getNestedIdentifierAtFromArray(node.elements, line, column);
            case "AssignmentExpression":
            case "BinaryExpression":
                return this.getNestedIdentifierAt(node.left, line, column) ?? this.getNestedIdentifierAt(node.right, line, column);
            case "CallExpression":
                return this.getNestedIdentifierAt(node.callee, line, column) ?? this.getNestedIdentifierAtFromArray(node.arguments, line, column);
            case "ConditionalExpression":
                return this.getNestedIdentifierAt(node.test, line, column) ?? this.getNestedIdentifierAt(node.consequent, line, column) ?? this.getNestedIdentifierAt(node.alternate, line, column);
            case "ContinueCaseStatement":
                return null;
            case "ContinueLoopStatement":
                return this.getNestedIdentifierAt(node.level, line, column);
            case "DoWhileStatement":
                return this.getNestedIdentifierAt(node.test, line, column) ?? this.getNestedIdentifierAtFromArray(node.body, line, column);
            case "EmptyStatement":
                return null;
            case "ExitLoopStatement":
                return this.getNestedIdentifierAt(node.level, line, column);
            case "ExitStatement":
                return this.getNestedIdentifierAt(node.argument, line, column);
            case "ExpressionStatement":
                return this.getNestedIdentifierAt(node.expression, line, column);
            case "ForInStatement":
                return this.getNestedIdentifierAt(node.left, line, column) ?? this.getNestedIdentifierAt(node.right, line, column) ?? this.getNestedIdentifierAtFromArray(node.body, line, column);
            case "ForStatement":
                return this.getNestedIdentifierAt(node.id, line, column) ??  this.getNestedIdentifierAt(node.init, line, column) ??  this.getNestedIdentifierAt(node.test, line, column) ??  this.getNestedIdentifierAt(node.update, line, column) ?? this.getNestedIdentifierAtFromArray(node.body, line, column);
            case "FunctionDeclaration":
                return this.getNestedIdentifierAt(node.id, line, column) ?? this.getNestedIdentifierAtFromArray(node.params, line, column) ?? this.getNestedIdentifierAtFromArray(node.body, line, column);
            case "Identifier":
                return node;
            case "IfStatement":
                let identifier = this.getNestedIdentifierAt(node.test, line, column);
                if (identifier === null) {
                    return Array.isArray(node.consequent) ? this.getNestedIdentifierAtFromArray(node.consequent, line, column) : this.getNestedIdentifierAt(node.consequent, line, column)
                }
                return identifier;
            case "IncludeOnceStatement":
                return null;
            case "IncludeStatement":
                return null;
            case "Keyword":
                return null;//FIXME: return keywords also?
            case "Literal":
                return null;
            case "LogicalExpression":
                return this.getNestedIdentifierAt(node.left, line, column) ?? this.getNestedIdentifierAt(node.right, line, column);
            case "Macro":
                return null;
            case "MemberExpression":
                return this.getNestedIdentifierAt(node.object, line, column) ?? this.getNestedIdentifierAt(node.property, line, column);
            case "MultiLineComment":
                return null;
            case "NotExpression":
                return this.getNestedIdentifierAt(node.value, line, column);
            case "Parameter":
                return this.getNestedIdentifierAt(node.id, line, column) ?? this.getNestedIdentifierAt(node.init, line, column);
            case "PreProcStatement":
                return null;
            case "RedimExpression":
                //return this.getNestedIdentifierAtFromArray(node.declarations, line, column);
                throw new Error("RedimExpression not correcly implemented as an AST node yet!");
            case "ReturnStatement":
                return this.getNestedIdentifierAt(node.value, line, column);
            case "SelectCase":
                return this.getNestedIdentifierAt(node.tests, line, column) ?? this.getNestedIdentifierAtFromArray(node.consequent, line, column);
            case "SelectStatement":
                return this.getNestedIdentifierAtFromArray(node.cases, line, column);
            case "SingleLineComment":
                return null;
            case "SwitchCase":
                return this.getNestedIdentifierAtFromArray(node.tests, line, column) ?? this.getNestedIdentifierAtFromArray(node.consequent, line, column);
            case "SwitchCaseRange":
                return this.getNestedIdentifierAt(node.from, line, column) ?? this.getNestedIdentifierAt(node.to, line, column);
            case "SwitchStatement":
                return this.getNestedIdentifierAt(node.discriminant, line, column) ?? this.getNestedIdentifierAtFromArray(node.cases, line, column);
            case "UnaryExpression":
                return this.getNestedIdentifierAt(node.argument, line, column)
            case "VariableDeclaration":
                return this.getNestedIdentifierAtFromArray(node.declarations, line, column);
            case "VariableDeclarator":
                return this.getNestedIdentifierAt(node.id, line, column) ?? this.getNestedIdentifierAt(node.init, line, column);
            case "VariableIdentifier":
                return node;
            case "WhileStatement":
                return this.getNestedIdentifierAt(node.test, line, column) ?? this.getNestedIdentifierAtFromArray(node.body, line, column);
            case "WithStatement":
                return this.getNestedIdentifierAt(node.object, line, column) ?? this.getNestedIdentifierAtFromArray(node.body, line, column);
            default:
                //@ts-ignore
                throw new Error("Unsupported type: "+node.type);
        }

        return null;
    }

    getNestedIdentifierAtFromArray(array: SourceElements|ArgumentList|VariableDeclarationList|FormalParameterList|(DefaultClause | CaseClause | SelectCaseClause)[]|ArrayDeclarationElementList|CaseValueList|null, line: number, column: number): VariableIdentifier|Identifier|null {// FunctionDeclaration|VariableDeclaration|Identifier|VariableIdentifier|null {
        if (array === null) {
            return null;
        }
        let result:VariableIdentifier|Identifier|null = null;
        for (const node of array) {
            result = this.getNestedIdentifierAt(node, line, column);
            if (result !== null) {
                return result;
            }
        }

        return null;
    }

    isPositionWithinLocation(line: number, column: number, location: LocationRange):boolean {
        if (location.start.line <= line && location.end.line >= line) {
            if (location.start.line === line && location.end.line === line) {
                return location.start.column <= column && location.end.column > column;
            }
            return true;
        }
        return false;
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
