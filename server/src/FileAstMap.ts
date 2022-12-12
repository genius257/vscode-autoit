import { URI, Utils } from 'vscode-uri';
import parser, { ArgumentList, ArrayDeclaration, ArrayDeclarationElementList, AssignmentExpression, AutoItParser, CallExpression, CaseClause, CaseValueList, DefaultClause, FormalParameter, FormalParameterList, FunctionDeclaration, Identifier, IdentifierName, IncludeFileName, IncludeStatement, LocationRange, Macro, Program, RedimIdentifierExpression, SelectCaseClause, SourceElement, SourceElements, SwitchCaseValue, VariableDeclaration, VariableDeclarationList, VariableIdentifier, VariableStatement } from "autoit3-pegjs";
import { Connection } from 'vscode-languageserver';

export type IncludeRef = IncludeStatement & {
    uri: string,
}

export type Includes = {
    global: IncludeRef[],
    scopes: {
        [scope: string]: IncludeRef[],
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

export type IncludeResolve = {uri: URI, text: string};
export type IncludePromise = Promise<IncludeResolve|null>;

export type AutoIt3Configuration = {
    "installDir": string|null,
    "userDefinedLibraries": string[],
    "version": string,
};

export type Node = SourceElement|AssignmentExpression|FormalParameter|VariableDeclaration|ArrayDeclaration|DefaultClause|CaseClause|SelectCaseClause|SwitchCaseValue|Macro|IncludeStatement;
export type NodeList = SourceElements|ArgumentList|VariableDeclarationList|FormalParameterList|(DefaultClause | CaseClause | SelectCaseClause)[]|ArrayDeclarationElementList|CaseValueList;

export enum NodeFilterAction {
    /** Adds the current node and continues down the branch */
    Continue,
    /** Does not add current node and continues down the branch */
    Skip,
    /** Does not add current node and continues but does not continue down the rest of current branch */
    SkipAndStopPropagation,
    /** Adds the current node and and continues but does not continue down the rest of current branch */
    StopPropagation,
    /** Does not add current node and does not continue */
    StopAndSkip,
    /** Adds the current node and does not continue */
    Stop,
};

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

        const previousIncludes = this.maps[uri].includes.global;
        //this.maps[uri].includes.global = []; //FIXME: this line causes issues with actions done during include resolve
        const includes = this.maps[uri].data.body.filter((node): node is IncludeStatement => node.type === "IncludeStatement")//.map((includeUri) => this.resolveIncludePath(uri, includeUri.file)) ?? [];

        //FIXME: includes global array should be set to includes that are not changed here.

        this.includeDifference(previousIncludes, includes).forEach(previousInclude => this.release(previousInclude.uri));
        this.includeDifference(includes, previousIncludes).forEach(include => {
            this.addInclude(uri, include)?.then(x => x !== null ? this.maps[uri].includes.global.push({...include, uri: x.uri.toString()}) : null);
        });

        //this.maps[uri].includes.global = includes.map(uri => ({uri: uri, once: false}));
    }

    addInclude(documentUri: string, include: IncludeStatement): IncludePromise {
        /*
        if (this.exists(uri)) {
            this.maps[uri].counter++;//FIXME: we need a addRef and Release thing instead, to free the key if count reaches zero.
            return;
        }

        this.maps[uri] = {
            counter: 0,
            data: {
                type: 'Program',
                body:[],
            },
            identifiers: {
                global: {},
                scopes: {},
            },
            includes: {
                global: [],
                scopes: {},
            },
            scopes: {},
        };
        */

        let promise = this.connection?.workspace.getConfiguration("autoit3").then((configuration: AutoIt3Configuration) => {
            let promise:IncludePromise = Promise.resolve(null);

            promise = include.library ? this.includeLibrary(include.file, promise, configuration) : this.includeLocal(include.file, documentUri, promise);

            promise = this.includeUserDefined(include.file, promise, configuration);

            promise = !include.library ? this.includeLibrary(include.file, promise, configuration) : this.includeLocal(include.file, documentUri, promise);

            return promise;
        }) ?? Promise.resolve(null);

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

        return promise;

        /*
        this.connection?.console.log("Loading URI: "+uri);
        this.connection?.sendRequest<string|null>("openTextDocument", uri).then((content) => {
            if (content !== null) {
                this.add(uri, this.parse(content, uri));
            } else {
                this.release(uri);
            }
        }).catch(reason => this.release(uri));
        */
    }

    protected includeLibrary(uri: string, promise: IncludePromise, configuration: AutoIt3Configuration|null): IncludePromise {
        return promise.then(x => x === null && typeof configuration?.installDir === "string" ? this.openTextDocument(Utils.resolvePath(URI.parse(configuration.installDir), uri)) : x);
    }

    protected includeUserDefined(uri: string, promise: IncludePromise, configuration: AutoIt3Configuration|null): IncludePromise {
        for (const path of configuration?.userDefinedLibraries ?? []) {
            promise = promise.then(x => x === null ? this.openTextDocument(Utils.resolvePath(URI.file(path), uri)) : null);
        }

        return promise;
    }

    protected includeLocal(uri: string, documentUri: string, promise: IncludePromise): IncludePromise {
        return promise.then(x => x === null ? this.openTextDocument(Utils.resolvePath(Utils.dirname(URI.parse(documentUri)), uri)) : x);
    }

    protected openTextDocument(uri: URI): IncludePromise {
        return this.connection?.sendRequest<string|null>("openTextDocument", uri.toString()).then<IncludeResolve|null>(x => x === null ? x : ({uri: uri, text: x})) ?? Promise.resolve(null);
    }

    resolveRelativeIncludePath(textDocumentUri: string, includeStatementUri: string): string {
        //FIXME: currently we only resolve the include uri's as "Script directory" includes. Implementation need for "User-defined libraries" and "Standard library".
        // An extra parameter indicating starting from script or standard library when looking for the file is needed.
        // This may hovever not be needed in the webworker version?
        return Utils.resolvePath(Utils.dirname(URI.parse(textDocumentUri)), includeStatementUri.replace(/\\/g, "/")).toString();
    }

    includeDifference<T extends IncludeStatement>(arr1: T[], arr2: IncludeStatement[]) {
        return arr1.filter(x => arr2.findIndex(y => x.file === y.file && x.library === y.library) === -1)
    }

    difference<T>(arr1: T[], arr2: T[]): T[] {
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
    getIdentifierDeclarator(uri: string, identifier: Identifier|VariableIdentifier|Macro|null, includes: boolean = true): FunctionDeclaration|VariableDeclaration|null {
        if (identifier?.type === "Macro") {
            return null;
        }
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

    isCallExpression(node: Node): node is CallExpression {
        return node.type === "CallExpression";
    }

    getCallExpressionAt(uri: string, line: number, column: number): CallExpression|null {
        return this.getNodesAt(uri, line, column).filter((node): node is CallExpression => this.isCallExpression(node)).pop() ?? null;
    }

    isIdentifier(node: Node): node is Identifier|VariableIdentifier|Macro {
        return ["Identifier", "VariableIdentifier", "Macro"].includes(node.type);
    }

    getNestedIdentifiers(node: Node|null): Identifier[]|null {
        const matches: Identifier[] = [];
        this.filterNestedNode(node, (node) => this.isIdentifier(node) ? NodeFilterAction.Continue : NodeFilterAction.Skip, matches);
        return matches;
    }

    /** get identifier object based on cursor position */
    getIdentifierAt(uri: string, line: number, column: number): Identifier|VariableIdentifier|Macro|null {
        for (const node of this.getNodesAt(uri, line, column)) {
            if (this.isIdentifier(node)) {
                return node;
            }
        }
        return null;

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

    /**
     * @deprecated use getNestedNodesAt instead.
     */
    getNestedIdentifierAt(node: SourceElement|AssignmentExpression|FormalParameter|VariableDeclaration|ArrayDeclaration|DefaultClause|CaseClause|SelectCaseClause|SwitchCaseValue|null, line: number, column: number): VariableIdentifier|Identifier|Macro|null {//FunctionDeclaration|VariableDeclaration|Identifier|IdentifierName|VariableIdentifier|null {
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
                return node;
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

    /**
     * @deprecated use getNestedNodesAtFromArray instead.
     */
    getNestedIdentifierAtFromArray(array: SourceElements|ArgumentList|VariableDeclarationList|FormalParameterList|(DefaultClause | CaseClause | SelectCaseClause)[]|ArrayDeclarationElementList|CaseValueList|null, line: number, column: number): VariableIdentifier|Identifier|Macro|null {// FunctionDeclaration|VariableDeclaration|Identifier|VariableIdentifier|null {
        if (array === null) {
            return null;
        }
        let result:VariableIdentifier|Identifier|Macro|null = null;
        for (const node of array) {
            result = this.getNestedIdentifierAt(node, line, column);
            if (result !== null) {
                return result;
            }
        }

        return null;
    }

    /** Get AST nodes at script position */
    getNodesAt(uri: string, line: number, column: number): Array<Node> {
        if (!this.exists(uri)) {
            throw new Error(`URI not found in map: ${uri}`);
        }

        const matches: Array<Node> = [];
        this.getNestedNodesAtFromArray(this.maps[uri].data.body, line, column, matches);
        return matches;
    }

    getNestedNodesAt(node: Node|null, line: number, column: number, matches: Array<Node>): Node|null {
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

        matches.push(node);

        switch (node.type) {
            case "ArrayDeclaration":
                return this.getNestedNodesAtFromArray(node.elements, line, column, matches);
            case "AssignmentExpression":
            case "BinaryExpression":
                return this.getNestedNodesAt(node.left, line, column, matches) ?? this.getNestedNodesAt(node.right, line, column, matches);
            case "CallExpression":
                return this.getNestedNodesAt(node.callee, line, column, matches) ?? this.getNestedNodesAtFromArray(node.arguments, line, column, matches);
            case "ConditionalExpression":
                return this.getNestedNodesAt(node.test, line, column, matches) ?? this.getNestedNodesAt(node.consequent, line, column, matches) ?? this.getNestedNodesAt(node.alternate, line, column, matches);
            case "ContinueCaseStatement":
                return null;
            case "ContinueLoopStatement":
                return this.getNestedNodesAt(node.level, line, column, matches);
            case "DoWhileStatement":
                return this.getNestedNodesAt(node.test, line, column, matches) ?? this.getNestedNodesAtFromArray(node.body, line, column, matches);
            case "EmptyStatement":
                return node;
            case "ExitLoopStatement":
                return this.getNestedNodesAt(node.level, line, column, matches);
            case "ExitStatement":
                return this.getNestedNodesAt(node.argument, line, column, matches);
            case "ExpressionStatement":
                return this.getNestedNodesAt(node.expression, line, column, matches);
            case "ForInStatement":
                return this.getNestedNodesAt(node.left, line, column, matches) ?? this.getNestedNodesAt(node.right, line, column, matches) ?? this.getNestedNodesAtFromArray(node.body, line, column, matches);
            case "ForStatement":
                return this.getNestedNodesAt(node.id, line, column, matches) ??  this.getNestedNodesAt(node.init, line, column, matches) ??  this.getNestedNodesAt(node.test, line, column, matches) ??  this.getNestedNodesAt(node.update, line, column, matches) ?? this.getNestedNodesAtFromArray(node.body, line, column, matches);
            case "FunctionDeclaration":
                return this.getNestedNodesAt(node.id, line, column, matches) ?? this.getNestedNodesAtFromArray(node.params, line, column, matches) ?? this.getNestedNodesAtFromArray(node.body, line, column, matches);
            case "Identifier":
                return node;
            case "IfStatement":
                let identifier = this.getNestedNodesAt(node.test, line, column, matches);
                if (identifier === null) {
                    return Array.isArray(node.consequent) ? this.getNestedNodesAtFromArray(node.consequent, line, column, matches) : this.getNestedNodesAt(node.consequent, line, column, matches)
                }
                return identifier;
            case "IncludeOnceStatement":
                return node;
            case "IncludeStatement":
                return node;
            case "Keyword":
                return node;//FIXME: return keywords also?
            case "Literal":
                return node;
            case "LogicalExpression":
                return this.getNestedNodesAt(node.left, line, column, matches) ?? this.getNestedNodesAt(node.right, line, column, matches);
            case "Macro":
                return node;
            case "MemberExpression":
                return this.getNestedNodesAt(node.object, line, column, matches) ?? this.getNestedNodesAt(node.property, line, column, matches);
            case "MultiLineComment":
                return node;
            case "NotExpression":
                return this.getNestedNodesAt(node.value, line, column, matches);
            case "Parameter":
                return this.getNestedNodesAt(node.id, line, column, matches) ?? this.getNestedNodesAt(node.init, line, column, matches);
            case "PreProcStatement":
                return node;
            case "RedimExpression":
                //return this.getNestedNodesAtFromArray(node.declarations, line, column);
                throw new Error("RedimExpression not correcly implemented as an AST node yet!");
            case "ReturnStatement":
                return this.getNestedNodesAt(node.value, line, column, matches);
            case "SelectCase":
                return this.getNestedNodesAt(node.tests, line, column, matches) ?? this.getNestedNodesAtFromArray(node.consequent, line, column, matches);
            case "SelectStatement":
                return this.getNestedNodesAtFromArray(node.cases, line, column, matches);
            case "SingleLineComment":
                return null;
            case "SwitchCase":
                return this.getNestedNodesAtFromArray(node.tests, line, column, matches) ?? this.getNestedNodesAtFromArray(node.consequent, line, column, matches);
            case "SwitchCaseRange":
                return this.getNestedNodesAt(node.from, line, column, matches) ?? this.getNestedNodesAt(node.to, line, column, matches);
            case "SwitchStatement":
                return this.getNestedNodesAt(node.discriminant, line, column, matches) ?? this.getNestedNodesAtFromArray(node.cases, line, column, matches);
            case "UnaryExpression":
                return this.getNestedNodesAt(node.argument, line, column, matches)
            case "VariableDeclaration":
                return this.getNestedNodesAtFromArray(node.declarations, line, column, matches);
            case "VariableDeclarator":
                return this.getNestedNodesAt(node.id, line, column, matches) ?? this.getNestedNodesAt(node.init, line, column, matches);
            case "VariableIdentifier":
                return node;
            case "WhileStatement":
                return this.getNestedNodesAt(node.test, line, column, matches) ?? this.getNestedNodesAtFromArray(node.body, line, column, matches);
            case "WithStatement":
                return this.getNestedNodesAt(node.object, line, column, matches) ?? this.getNestedNodesAtFromArray(node.body, line, column, matches);
            default:
                //@ts-ignore
                throw new Error("Unsupported type: "+node.type);
        }

        return null;
    }

    getNestedNodesAtFromArray(nodeList: NodeList|null, line: number, column: number, matches: Array<Node>): Node|null {
        if (nodeList === null) {
            return null;
        }

        let result:Node|null = null;
        for (const node of nodeList) {
            result = this.getNestedNodesAt(node, line, column, matches) ?? result;
        }

        return result ?? null;
    }

    /**
     * Filter nodes and returned flattened array with results.
     */
    filterNodes(uri: string, fn: (node: Node) => NodeFilterAction|never): Array<Node> {
        if (!this.exists(uri)) {
            throw new Error(`URI not found in map: ${uri}`);
        }
        
        const matches: Array<Node> = [];
        this.filterNestedNodes(this.maps[uri].data.body, fn, matches);
        return matches;
    }

    filterNestedNode(node: Node|null, fn: (node: Node) => NodeFilterAction|never, matches: Array<Node>): NodeFilterAction {
        if (node === null) {
            return NodeFilterAction.Skip;
        }

        switch (fn(node)) {
            case NodeFilterAction.Continue:
                matches.push(node);
                break;
            case NodeFilterAction.Skip:
                //Do nothing.
                break;
            case NodeFilterAction.SkipAndStopPropagation:
                return NodeFilterAction.Continue;
            case NodeFilterAction.Stop:
                matches.push(node);
                return NodeFilterAction.Stop;
            case NodeFilterAction.StopAndSkip:
                return NodeFilterAction.Stop;
            case NodeFilterAction.StopPropagation:
                return NodeFilterAction.Continue;
        }

        switch (node.type) {
            case "ArrayDeclaration":
                return this.filterNestedNodes(node.elements, fn, matches);
            case "AssignmentExpression":
            case "BinaryExpression":
                return this.filterNestedNode(node.left, fn, matches) ?? this.filterNestedNode(node.right, fn, matches);
            case "CallExpression":
                return this.filterNestedNode(node.callee, fn, matches) ?? this.filterNestedNodes(node.arguments, fn, matches);
            case "ConditionalExpression":
                return this.filterNestedNode(node.test, fn, matches) ?? this.filterNestedNode(node.consequent, fn, matches) ?? this.filterNestedNode(node.alternate, fn, matches);
            case "ContinueCaseStatement":
                break;
            case "ContinueLoopStatement":
                return this.filterNestedNode(node.level, fn, matches);
            case "DoWhileStatement":
                return this.filterNestedNode(node.test, fn, matches) ?? this.filterNestedNodes(node.body, fn, matches);
            case "EmptyStatement":
                break;
            case "ExitLoopStatement":
                return this.filterNestedNode(node.level, fn, matches);
            case "ExitStatement":
                return this.filterNestedNode(node.argument, fn, matches);
            case "ExpressionStatement":
                return this.filterNestedNode(node.expression, fn, matches);
            case "ForInStatement":
                return this.filterNestedNode(node.left, fn, matches) ?? this.filterNestedNode(node.right, fn, matches) ?? this.filterNestedNodes(node.body, fn, matches);
            case "ForStatement":
                return this.filterNestedNode(node.id, fn, matches) ??  this.filterNestedNode(node.init, fn, matches) ??  this.filterNestedNode(node.test, fn, matches) ??  this.filterNestedNode(node.update, fn, matches) ?? this.filterNestedNodes(node.body, fn, matches);
            case "FunctionDeclaration":
                return this.filterNestedNode(node.id, fn, matches) ?? this.filterNestedNodes(node.params, fn, matches) ?? this.filterNestedNodes(node.body, fn, matches);
            case "Identifier":
                break;
            case "IfStatement":
                let identifier = this.filterNestedNode(node.test, fn, matches);
                if (identifier === null) {
                    return Array.isArray(node.consequent) ? this.filterNestedNodes(node.consequent, fn, matches) : this.filterNestedNode(node.consequent, fn, matches)
                }
                return identifier;
            case "IncludeOnceStatement":
                break;
            case "IncludeStatement":
                break;
            case "Keyword":
                break;
            case "Literal":
                break;
            case "LogicalExpression":
                return this.filterNestedNode(node.left, fn, matches) ?? this.filterNestedNode(node.right, fn, matches);
            case "Macro":
                break;
            case "MemberExpression":
                return this.filterNestedNode(node.object, fn, matches) ?? this.filterNestedNode(node.property, fn, matches);
            case "MultiLineComment":
                break;
            case "NotExpression":
                return this.filterNestedNode(node.value, fn, matches);
            case "Parameter":
                return this.filterNestedNode(node.id, fn, matches) ?? this.filterNestedNode(node.init, fn, matches);
            case "PreProcStatement":
                break;
            case "RedimExpression":
                //return this.filterNestedNodes(node.declarations, line, column);
                throw new Error("RedimExpression not correcly implemented as an AST node yet!");
            case "ReturnStatement":
                return this.filterNestedNode(node.value, fn, matches);
            case "SelectCase":
                return this.filterNestedNode(node.tests, fn, matches) ?? this.filterNestedNodes(node.consequent, fn, matches);
            case "SelectStatement":
                return this.filterNestedNodes(node.cases, fn, matches);
            case "SingleLineComment":
                break;
            case "SwitchCase":
                return this.filterNestedNodes(node.tests, fn, matches) ?? this.filterNestedNodes(node.consequent, fn, matches);
            case "SwitchCaseRange":
                return this.filterNestedNode(node.from, fn, matches) ?? this.filterNestedNode(node.to, fn, matches);
            case "SwitchStatement":
                return this.filterNestedNode(node.discriminant, fn, matches) ?? this.filterNestedNodes(node.cases, fn, matches);
            case "UnaryExpression":
                return this.filterNestedNode(node.argument, fn, matches)
            case "VariableDeclaration":
                return this.filterNestedNodes(node.declarations, fn, matches);
            case "VariableDeclarator":
                return this.filterNestedNode(node.id, fn, matches) ?? this.filterNestedNode(node.init, fn, matches);
            case "VariableIdentifier":
                break;
            case "WhileStatement":
                return this.filterNestedNode(node.test, fn, matches) ?? this.filterNestedNodes(node.body, fn, matches);
            case "WithStatement":
                return this.filterNestedNode(node.object, fn, matches) ?? this.filterNestedNodes(node.body, fn, matches);
            default:
                //@ts-ignore
                throw new Error("Unsupported type: "+node.type);
        }

        return NodeFilterAction.Continue;
    }

    filterNestedNodes(nodeList: NodeList|null, fn: (node: Node) => NodeFilterAction|never, matches: Array<Node>): NodeFilterAction {
        if (nodeList === null) {
            return NodeFilterAction.Skip;
        }

        for (const node of nodeList) {
            switch(this.filterNestedNode(node, fn, matches)) {
                case NodeFilterAction.Stop:
                case NodeFilterAction.StopAndSkip:
                case NodeFilterAction.StopPropagation:
                    return NodeFilterAction.Stop;
            }
        }

        return NodeFilterAction.Continue;
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
