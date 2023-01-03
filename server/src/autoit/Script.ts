import parser, { ArgumentList, ArrayDeclaration, ArrayDeclarationElementList, AssignmentExpression, CaseClause, CaseValueList, DefaultClause, FormalParameter, FormalParameterList, FunctionDeclaration, IdentifierName, IncludeStatement, Macro, Program, SelectCaseClause, SourceElement, SourceElements, SwitchCaseValue, VariableDeclaration, VariableDeclarationList, VariableIdentifier } from "autoit3-pegjs";
import { Diagnostic, DiagnosticSeverity, Position } from "vscode-languageserver";
import { URI } from 'vscode-uri';
import AST from './AST';
import Parser from "./Parser";
import { Workspace } from "./Workspace";

export type Include = {
    /** Resolved include statement URI path */
    promise: Promise<string | null>;
    uri: string|null;
    statement: IncludeStatement;
}

export type ScriptError = Diagnostic & { severity: typeof DiagnosticSeverity.Error };
export type ScriptWarning = Diagnostic & { severity: typeof DiagnosticSeverity.Warning };
export type ScriptInformation = Diagnostic & { severity: typeof DiagnosticSeverity.Information };
export type ScriptHint = Diagnostic & { severity: typeof DiagnosticSeverity.Hint };

export type ScriptDiagnostic = ScriptError | ScriptWarning | ScriptInformation | ScriptHint;

export type Node = SourceElement | AssignmentExpression | FormalParameter | VariableDeclaration | ArrayDeclaration | DefaultClause | CaseClause | SelectCaseClause | SwitchCaseValue | Macro | IncludeStatement;
export type NodeList = SourceElements | ArgumentList | VariableDeclarationList | FormalParameterList | (DefaultClause | CaseClause | SelectCaseClause)[] | ArrayDeclarationElementList | CaseValueList;

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

export default class Script {
    public workspace: Workspace | undefined;
    protected uri: URI | undefined;

    protected errors: Array<ScriptError> = [];
    protected warnings: Array<ScriptWarning> = [];
    protected informations: Array<ScriptInformation> = [];
    protected hints: Array<ScriptHint> = [];

    /** A cache of all currently resolved include statements, for the current script instance */
    protected includeCache: Array<Include> = [];//FIXME: if script is moved, this needs to be cleared.
    protected includes: Array<Include> = [];

    /** Reference count */
    protected refCount: number = 1;

    protected program: Program | undefined;

    public declarations: Array<FunctionDeclaration | VariableDeclaration> = [];//FIXME: varaible declarations with the global scope should be added here aswell.

    constructor(text: string, uri?: URI, workspace: Workspace | undefined = undefined) {
        this.uri = uri;
        this.workspace = workspace;
        this.parseText(text);
    }

    public getDiagnostics(): Array<Diagnostic> {
        return [
            ...this.errors,
            ...this.warnings,
            ...this.informations,
            ...this.hints,
        ];
    }

    public resetDiagnostics(): void {
        this.errors = [];
        this.warnings = [];
        this.informations = [];
        this.hints = [];

        this.triggerDiagnostics();
    }

    public triggerDiagnostics(): void {
        if (this.uri !== undefined) {
            this.workspace?.triggerDiagnostics(this.uri.toString(), this.getDiagnostics());
        }
    }

    protected parseText(text: string) {
        try {
            this.program = parser.parse(text, { grammarSource: this.uri?.toString() });
            this.analyze();//FIXME: currently this is just to test.
        } catch (e) {
            if (!Parser.isSyntaxError(e)) {
                throw e;
            }

            this.addError({
                message: e.message,
                range: Parser.locationToRange(e.location),
            });
        }
    }

    /** Update the script text content */
    public update(text: string) {
        this.resetDiagnostics();
        this.parseText(text);
    }

    public addReference(): number {
        return ++this.refCount;
    }

    public release(): number {
        if (0 >= --this.refCount) {
            if (this.uri !== undefined) {
                this.workspace?.remove(this.uri);
            }
            this.workspace = undefined;
            this.resetDiagnostics();
        }

        return this.refCount;
    }

    public analyze() {
        this.declarations = <Array<FunctionDeclaration | VariableDeclaration>><unknown>this.filterNodes((node) => {
            const isDeclerator = node.type === "FunctionDeclaration" || node.type === "VariableDeclarator";
            return isDeclerator ? NodeFilterAction.StopPropagation : NodeFilterAction.Skip;
        });

        //const previousIncludes = this.includes;
        const currrentIncludes = this.program?.body.filter((node): node is IncludeStatement => node.type === "IncludeStatement");

        //const detached = previousIncludes.filter(previous => currrentIncludes?.findIndex(current => previous.statement.file === current.file && previous.statement.library === current.library) === -1);
        //const added = currrentIncludes?.filter(current => previousIncludes?.findIndex(previous => previous.statement.file === current.file && previous.statement.library === current.library) === -1);

        this.includes = currrentIncludes?.map((include) => {
            const cacheIndex = this.includeCache.findIndex(cacheItem => cacheItem.statement.file === include.file && cacheItem.statement.library === include.library);
            if (cacheIndex > -1) {
                this.includeCache[cacheIndex].statement = include;
                return this.includeCache[cacheIndex];
            }

            const newInclude = this.createInclude(include);
            this.includeCache.push(newInclude);
            return newInclude;
        }) ?? [];
    }

    public createInclude(include: IncludeStatement): Include {
        const _include: Include = {
            statement: include,
            uri: null,
            promise: this.workspace?.resolveInclude(include).then(value => value?.uri.toString() ?? null) ?? Promise.resolve(null),
        };

        _include.promise.then(value => _include.uri = value);

        return _include;
    }

    public updateContent() {
        throw new Error("Not implemented");//FIXME: implement
    }

    public addDiagnostic(diagnostic: ScriptDiagnostic) {
        const severity = diagnostic.severity;
        let diagnosticArray: Array<Diagnostic> | undefined;
        switch (severity) {
            case DiagnosticSeverity.Error:
                diagnosticArray = this.errors;
                break;
            case DiagnosticSeverity.Warning:
                diagnosticArray = this.warnings;
                break;
            case DiagnosticSeverity.Information:
                diagnosticArray = this.informations;
                break;
            case DiagnosticSeverity.Hint:
                diagnosticArray = this.hints;
                break;
            default:
                this.assertCannotReach(severity, `Unsupported diagnostic severity: "${severity}"`);
        }

        diagnosticArray.push(diagnostic);
        this.triggerDiagnostics();
    }

    public addError(error: Omit<ScriptError, "severity"> & Partial<Pick<ScriptError, "severity">>) {
        this.addDiagnostic({
            ...error,
            severity: DiagnosticSeverity.Error,
        });
    }

    public addWarning(warning: Omit<ScriptWarning, "severity"> & Partial<Pick<ScriptWarning, "severity">>) {
        this.addDiagnostic({
            ...warning,
            severity: DiagnosticSeverity.Warning,
        });
    }

    public addInformation(information: Omit<ScriptInformation, "severity"> & Partial<Pick<ScriptInformation, "severity">>) {
        this.addDiagnostic({
            ...information,
            severity: DiagnosticSeverity.Information,
        });
    }

    public addHint(hint: Omit<ScriptHint, "severity"> & Partial<Pick<ScriptHint, "severity">>) {
        this.addDiagnostic({
            ...hint,
            severity: DiagnosticSeverity.Hint
        });
    }

    public getUri(): URI | undefined {
        return this.uri;
    }

    public getNodesAt(position: Position): Array<AST.Node>;
    public getNodesAt(line: number, column: number): Array<AST.Node>;
    public getNodesAt(line: Position | number, column: number = 0): Array<AST.Node> {
        if (typeof line !== "number") {
            column = line.character + 1;
            line = line.line + 1;
        }

        return this.getNestedNodesAtFromArray(this.program?.body ?? null, line, column, []);
    }

    protected assertCannotReach(x: never, message: string = "Unexpected unreachable code reached."): never {
        throw new Error(message);
    }

    /** @internal */
    public getNestedNodesAt(node: AST.Node | null, line: number, column: number, matches: Array<AST.Node>): Array<AST.Node> {
        if (node === null) {
            return matches;
        }

        if (node.location === undefined) {
            throw new Error("location is undefined on node type: " + node.type);
        }

        if (node.type !== "MemberExpression" && !Parser.isPositionWithinLocation(line, column, node.location)) {
            return matches;
        }

        matches.push(node);

        const type = node.type;
        switch (type) {
            case "ArrayDeclaration":
                return this.getNestedNodesAtFromArray(node.elements, line, column, matches);
            case "AssignmentExpression":
            case "BinaryExpression":
                this.getNestedNodesAt(node.left, line, column, matches);
                this.getNestedNodesAt(node.right, line, column, matches);
                break;
            case "CallExpression":
                this.getNestedNodesAt(node.callee, line, column, matches);
                this.getNestedNodesAtFromArray(node.arguments, line, column, matches);
                break;
            case "ConditionalExpression":
                this.getNestedNodesAt(node.test, line, column, matches);
                this.getNestedNodesAt(node.consequent, line, column, matches);
                this.getNestedNodesAt(node.alternate, line, column, matches);
                break;
            case "ContinueCaseStatement":
                break;
            case "ContinueLoopStatement":
                return this.getNestedNodesAt(node.level, line, column, matches);
            case "DoWhileStatement":
                this.getNestedNodesAt(node.test, line, column, matches);
                this.getNestedNodesAtFromArray(node.body, line, column, matches);
                break;
            case "EmptyStatement":
                break;
            case "ExitLoopStatement":
                return this.getNestedNodesAt(node.level, line, column, matches);
            case "ExitStatement":
                return this.getNestedNodesAt(node.argument, line, column, matches);
            case "ExpressionStatement":
                return this.getNestedNodesAt(node.expression, line, column, matches);
            case "ForInStatement":
                this.getNestedNodesAt(node.left, line, column, matches);
                this.getNestedNodesAt(node.right, line, column, matches);
                this.getNestedNodesAtFromArray(node.body, line, column, matches);
                break;
            case "ForStatement":
                this.getNestedNodesAt(node.id, line, column, matches);
                this.getNestedNodesAt(node.init, line, column, matches);
                this.getNestedNodesAt(node.test, line, column, matches);
                this.getNestedNodesAt(node.update, line, column, matches);
                this.getNestedNodesAtFromArray(node.body, line, column, matches);
                break;
            case "FunctionDeclaration":
                this.getNestedNodesAt(node.id, line, column, matches);
                this.getNestedNodesAtFromArray(node.params, line, column, matches);
                this.getNestedNodesAtFromArray(node.body, line, column, matches);
                break;
            case "Identifier":
                break;
            case "IfStatement":
                this.getNestedNodesAt(node.test, line, column, matches);
                Array.isArray(node.consequent) ? this.getNestedNodesAtFromArray(node.consequent, line, column, matches) : this.getNestedNodesAt(node.consequent, line, column, matches)
                break;
            case "IncludeOnceStatement":
                break;
            case "IncludeStatement":
                break;
            case "Keyword":
                break;//FIXME: return keywords also?
            case "Literal":
                break;
            case "LogicalExpression":
                this.getNestedNodesAt(node.left, line, column, matches);
                this.getNestedNodesAt(node.right, line, column, matches);
                break;
            case "Macro":
                break;
            case "MemberExpression":
                this.getNestedNodesAt(node.object, line, column, matches);
                this.getNestedNodesAt(node.property, line, column, matches);
                break;
            case "MultiLineComment":
                break;
            case "NotExpression":
                return this.getNestedNodesAt(node.value, line, column, matches);
            case "Parameter":
                this.getNestedNodesAt(node.id, line, column, matches);
                this.getNestedNodesAt(node.init, line, column, matches);
                break;
            case "PreProcStatement":
                break;
            case "RedimExpression":
                //return this.getNestedNodesAtFromArray(node.declarations, line, column);
                throw new Error("RedimExpression not correcly implemented as an AST node yet!");
            case "ReturnStatement":
                return this.getNestedNodesAt(node.value, line, column, matches);
            case "SelectCase":
                this.getNestedNodesAt(node.tests, line, column, matches);
                this.getNestedNodesAtFromArray(node.consequent, line, column, matches);
                break;
            case "SelectStatement":
                return this.getNestedNodesAtFromArray(node.cases, line, column, matches);
            case "SingleLineComment":
                break;
            case "SwitchCase":
                this.getNestedNodesAtFromArray(node.tests, line, column, matches);
                this.getNestedNodesAtFromArray(node.consequent, line, column, matches);
                break;
            case "SwitchCaseRange":
                this.getNestedNodesAt(node.from, line, column, matches);
                this.getNestedNodesAt(node.to, line, column, matches);
                break;
            case "SwitchStatement":
                this.getNestedNodesAt(node.discriminant, line, column, matches);
                this.getNestedNodesAtFromArray(node.cases, line, column, matches);
                break;
            case "UnaryExpression":
                return this.getNestedNodesAt(node.argument, line, column, matches)
            case "VariableDeclaration":
                return this.getNestedNodesAtFromArray(node.declarations, line, column, matches);
            case "VariableDeclarator":
                this.getNestedNodesAt(node.id, line, column, matches);
                this.getNestedNodesAt(node.init, line, column, matches);
                break;
            case "VariableIdentifier":
                break;
            case "WhileStatement":
                this.getNestedNodesAt(node.test, line, column, matches);
                this.getNestedNodesAtFromArray(node.body, line, column, matches);
                break;
            case "WithStatement":
                return this.getNestedNodesAt(node.object, line, column, matches) ?? this.getNestedNodesAtFromArray(node.body, line, column, matches);
            default:
                this.assertCannotReach(node, `Unsupported node type: "${type}"`);
        }

        return matches;
    }

    /** @internal */
    protected getNestedNodesAtFromArray(nodeList: AST.NodeList | null, line: number, column: number, matches: Array<AST.Node>): Array<AST.Node> {
        if (nodeList === null) {
            return matches;
        }

        for (const node of nodeList) {
            this.getNestedNodesAt(node, line, column, matches);
        }

        return matches;
    }

    /**
     * Filter nodes and returned flattened array with results.
     */
    filterNodes(fn: (node: Node) => NodeFilterAction | never): Array<Node> {
        const matches: Array<Node> = [];
        this.filterNestedNodes(this.program?.body ?? null, fn, matches);
        return matches;
    }

    filterNestedNode(node: Node | null, fn: (node: Node) => NodeFilterAction | never, matches: Array<Node>): NodeFilterAction {
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
                matches.push(node);
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
                return this.filterNestedNode(node.id, fn, matches) ?? this.filterNestedNode(node.init, fn, matches) ?? this.filterNestedNode(node.test, fn, matches) ?? this.filterNestedNode(node.update, fn, matches) ?? this.filterNestedNodes(node.body, fn, matches);
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
                throw new Error("Unsupported type: " + node.type);
        }

        return NodeFilterAction.Continue;
    }

    filterNestedNodes(nodeList: NodeList | null, fn: (node: Node) => NodeFilterAction | never, matches: Array<Node>): NodeFilterAction {
        if (nodeList === null) {
            return NodeFilterAction.Skip;
        }

        for (const node of nodeList) {
            switch (this.filterNestedNode(node, fn, matches)) {
                case NodeFilterAction.Stop:
                case NodeFilterAction.StopAndSkip:
                case NodeFilterAction.StopPropagation:
                    return NodeFilterAction.Stop;
            }
        }

        return NodeFilterAction.Continue;
    }

    /**
     * Get the declarator for the matching identifier.
     * @param identifier identifier to find a matching declarator for
     * @param stack a stack of already processed uri's that will be skipped from being processed any further.
     */
    public getIdentifierDeclarator(identifier: IdentifierName | VariableIdentifier | Macro | null, stack: string[] = []): FunctionDeclaration | VariableDeclaration | null {
        if (identifier === null || identifier.type === "Macro") {
            return null;
        }

        const uri = this.uri?.toString();

        if (uri !== undefined) {
            if (stack.includes(uri)) {
                return null;
            }

            stack.push(uri);
        }

        // first we check current script for a declaration.
        let declaration: FunctionDeclaration | VariableDeclaration | undefined | null = this.filterNodes((node) => {
            switch (node.type) {
                case "FunctionDeclaration":
                    return identifier.type === "Identifier" && identifier.name.toLowerCase() === node.id.name.toLowerCase() ? NodeFilterAction.Stop : NodeFilterAction.Skip;
                case "VariableDeclarator":
                    return identifier.type === "VariableIdentifier" && node.id.name.toLowerCase() === identifier.name.toLowerCase() ? NodeFilterAction.Stop : NodeFilterAction.Skip;
                //case "VariableDeclaration":
                    //node.
                    //return identifier.type === "VariableIdentifier" && node.declarations.find((value) => value.id.name.toLowerCase() === identifier.name.toLowerCase()) ? NodeFilterAction.Stop : NodeFilterAction.Skip;
                default:
                    return NodeFilterAction.Skip;
                    break;
            }
        })[0] as FunctionDeclaration | VariableDeclaration | undefined;

        if (declaration === undefined && this.workspace !== undefined) {
            for (const include of this.includes) {
                if (include.uri !== null) {
                    declaration = this.workspace.get(include.uri)?.getIdentifierDeclarator(identifier, stack);
                    if (declaration !== null && declaration !== undefined) {
                        break;
                    }
                }
            }
        }

        return declaration as FunctionDeclaration | VariableDeclaration | undefined | null ?? null;
    }
}
