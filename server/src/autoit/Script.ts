import parser, { ArgumentList, ArrayDeclaration, ArrayDeclarationElementList, AssignmentExpression, CaseClause, CaseValueList, DefaultClause, ElseClause, ElseIfClause, ElseIfClauses, EnumDeclaration, EnumDeclarationList, FormalParameter, FormalParameterList, FunctionDeclaration, IdentifierName, IncludeStatement, LocationRange, Macro, Program, SelectCaseClause, SourceElement, SourceElements, SwitchCaseValue, VariableDeclaration, VariableDeclarationList, VariableIdentifier } from "autoit3-pegjs";
import { Diagnostic, DiagnosticSeverity, /*DiagnosticTag,*/ Position } from "vscode-languageserver";
import { URI } from 'vscode-uri';
import Parser from "./Parser";
import { Workspace } from "./Workspace";
import PositionHelper from "./PositionHelper";
import debounce from "../utils/debounce";

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

export type Node = SourceElement | AssignmentExpression | FormalParameter | VariableDeclaration | EnumDeclaration | ArrayDeclaration | DefaultClause | CaseClause | SelectCaseClause | SwitchCaseValue | Macro | IncludeStatement | ElseIfClause | ElseClause;
export type NodeList = SourceElements | ArgumentList | VariableDeclarationList | EnumDeclarationList | FormalParameterList | (DefaultClause | CaseClause | SelectCaseClause)[] | ArrayDeclarationElementList | CaseValueList | ElseIfClauses | ElseClause[];

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
    protected text: string;

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
        this.text = text;
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

    protected debouncedTriggerDiagnostics: (() => void) | null = null;

    public triggerDiagnostics(): void {
        
        this.debouncedTriggerDiagnostics ??= debounce(() => {
            if (this.uri !== undefined) {
                this.workspace?.triggerDiagnostics(this.uri.toString(), this.getDiagnostics());
            }
        }, 100);

        this.debouncedTriggerDiagnostics();
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
                message: `Syntax error: ${e.message}`,
                range: PositionHelper.locationRangeToRange(e.location),
            });
        }
    }

    /** Update the script text content */
    public update(text: string) {
        this.text = text;
        this.resetDiagnostics();
        this.parseText(text);
    }

    public addReference(): number {
        return ++this.refCount;
    }

    public release(): number {
        /*
        if (0 >= --this.refCount) {
            if (this.uri !== undefined) {
                this.workspace?.remove(this.uri);
            }
            this.workspace = undefined;
            this.resetDiagnostics();
        }
        */

        return this.refCount;
    }

    public analyze() {
        this.declarations = <Array<FunctionDeclaration | VariableDeclaration>><unknown>this.filterNodes((node) => {
            const isDeclerator = node.type === "FunctionDeclaration" || node.type === "VariableDeclarator";
            return isDeclerator ? NodeFilterAction.StopPropagation : NodeFilterAction.Skip;
        });

        //const previousIncludes = this.includes;
        const currrentIncludes = this.program?.body.filter((node): node is IncludeStatement => node.type === "IncludeStatement");

        // function for comparing include statements
        const includeStatementComparator = (a: IncludeStatement, b: IncludeStatement): boolean => {
            return a.file === b.file && a.library === b.library;
        };

        //const detached = previousIncludes.filter(previous => currrentIncludes?.findIndex(current => previous.statement.file === current.file && previous.statement.library === current.library) === -1);
        //const added = currrentIncludes?.filter(current => previousIncludes?.findIndex(previous => previous.statement.file === current.file && previous.statement.library === current.library) === -1);

        // Get the detached includes
        const detached = this.includes.filter(
          (include) =>
            currrentIncludes?.findIndex((current) =>
              includeStatementComparator(include.statement, current)
            ) === -1
        );

        // release the detached includes
        detached.forEach((include) => {
            include.promise.then(value => {
                if (value !== null) {
                    this.workspace?.get(value)?.release();
                }
            });
        });

        // Update the list of includes
        this.includes = currrentIncludes?.map((include) => {
            // Check if the include statement is already cached
            const cacheIndex = this.includeCache.findIndex(cacheItem => cacheItem.statement.file === include.file && cacheItem.statement.library === include.library);
            // If it is, use the cached version
            if (cacheIndex > -1) {
                this.includeCache[cacheIndex]!.statement = include;
                this.includeCache[cacheIndex]!.promise.then(value => {if (value !== null) {this.workspace?.get(value)?.addReference()}});
                return this.includeCache[cacheIndex]!;
            }

            // If not, create a new include, and add it to the cache
            const newInclude = this.createInclude(include);
            this.includeCache.push(newInclude);
            return newInclude;
        }) ?? [];

        // Report includes that could not be resolved to the user
        this.includes.forEach(include => include.promise.then(value => {
            if (value === null) {
                this.addError({
                    message: `Could not resolve include: '${include.statement.file}'`,
                    range: PositionHelper.locationRangeToRange(include.statement.location),
                });

                //return;
            }

            /*
            //FIXME: currently this will not trigger when opening a file with includes that have errors, since the included file is not yet parsed.
            // To fix this we need to subscribe to the included file's diagnostics.
            // This should not be implemented yet, before the parser is fully compatible with AutoIt, as it currently reports false positives for some edge cases and have not implemented the with statement yet.

            //@ts-expect-error
            const severity = this.workspace?.get(value)?.getDiagnostics().reduce((acc, diagnostic) => {
                return acc === undefined || diagnostic.severity === undefined || diagnostic.severity < acc ? diagnostic.severity : acc;
            }, undefined);

            let highestSeverity: undefined | DiagnosticSeverity = undefined;
            const relatedDiagnostics = this.workspace?.get(value)?.getDiagnostics().filter(diagnostic => {
                if (diagnostic.severity === undefined || diagnostic.severity > DiagnosticSeverity.Warning) {
                    return false;
                }
                highestSeverity = highestSeverity === undefined || diagnostic.severity < highestSeverity ? diagnostic.severity : highestSeverity;
                return diagnostic.severity === highestSeverity;
            }) ?? [];

            if (highestSeverity !== undefined) {
                const errorCount = relatedDiagnostics.filter(diagnostic => diagnostic.severity === DiagnosticSeverity.Error).length;
                const warningCount = relatedDiagnostics.filter(diagnostic => diagnostic.severity === DiagnosticSeverity.Warning).length;
                const diagnosticStrings = [errorCount > 0 ? `${errorCount} error${errorCount > 1 ? 's' : ''}` : null, warningCount > 0 ?`${warningCount} warning${warningCount > 1 ? 's' : ''}` : null].filter(value => value !== null);
                this.addDiagnostic({
                    severity: highestSeverity,
                    message: `${diagnosticStrings.join(' and ')} were found in '${include.statement.file}'`,
                    range: PositionHelper.locationRangeToRange(include.statement.location),
                    relatedInformation: relatedDiagnostics.map(diagnostic => {
                        return {
                            location: {uri: value, range: diagnostic.range},
                            message: diagnostic.message,
                        };
                    })
                });
            }
            */
        }));

        //TODO: This URI needs to only be declared once, and imported wherever needed.
        const uri = URI.from({scheme: 'autoit3doc', 'path': 'native.au3'}).toString();

        // Adding native include at the top of the list, to make sure it is always processed first.
        this.includes.unshift({
            statement: {type: "IncludeStatement", file: '', library: true, location: {source: '',start: {line: 1, column: 1, offset: 0}, end: {line: 1, column: 1, offset: 0}}},
            uri,
            promise: Promise.resolve(uri),
        });
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

    /**
     * Adds diagnostic information to the current script and broadcast it to subscribers
     */
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

        // <message>. <source>(<code>)
        // If codeDescription href is set, code will be wrapped in a link with that href
        // diagnostic.code = "code";
        /*
        diagnostic.codeDescription = {
            href: "https://example.com",
        };
        */
       //diagnostic.source = "source";
       //diagnostic.tags = [DiagnosticTag.Unnecessary, DiagnosticTag.Deprecated];

        diagnostic.source ??= "AutoIt";

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

    public getNodesAt(position: Position): Array<Node>;
    public getNodesAt(line: number, column: number): Array<Node>;
    public getNodesAt(line: Position | number, column: number = 0): Array<Node> {
        if (typeof line !== "number") {
            column = line.character + 1;
            line = line.line + 1;
        }

        return this.getNestedNodesAtFromArray(this.program?.body ?? null, line, column, []);
    }

    //FIXME: move this to a helper file
    protected assertCannotReach(x: never, message: string = "Unexpected unreachable code reached."): never {
        throw new Error(message);
    }

    /** @internal */
    public getNestedNodesAt(node: Node | null, line: number, column: number, matches: Array<Node>): Array<Node> {
        if (node === null) {
            return matches;
        }

        if (node.location === undefined) {
            throw new Error("location is undefined on node type: " + node.type);
        }

        // FIXME: add inline documentation for the "MemberExpression" case
        // FIXME: "CallExpression" case exists because nested call expressions have a bug with the wrapping expression position only covering the trailing parentheses. The fix need to be implemented in the parser.
        if (node.type !== "MemberExpression" && node.type !== "CallExpression" && !Parser.isPositionWithinLocation(line, column, node.location)) {
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
            case "ElseIfStatement":
                this.getNestedNodesAt(node.test, line, column, matches);
                this.getNestedNodesAtFromArray(node.consequent, line, column, matches);
                break;
            case "ElseStatement":
                this.getNestedNodesAtFromArray(node.consequent, line, column, matches);
                break;
            case "EmptyStatement":
                break;
            case "EnumDeclaration":
                return this.getNestedNodesAtFromArray(node.declarations, line, column, matches);
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
                if ('alternate' in node ) {
                    this.getNestedNodesAtFromArray(node.alternate, line, column, matches);
                }
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
                //NOTE: redim ts type is not implemented as of writing this code iteration, and not needed for current intellisense anyways.
                //TODO: implement at a later date, for hover support on the variables, and more.
                break;
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
                this.getNestedNodesAt(node.object, line, column, matches);
                this.getNestedNodesAtFromArray(node.body, line, column, matches);
                break;
            default:
                this.assertCannotReach(node, `Unsupported node type: "${type}"`);
        }

        return matches;
    }

    /** @internal */
    protected getNestedNodesAtFromArray(nodeList: NodeList | null, line: number, column: number, matches: Array<Node>): Array<Node> {
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

        let status: NodeFilterAction = NodeFilterAction.Continue;
        switch (node.type) {
            case "ArrayDeclaration":
                return this.filterNestedNodes(node.elements, fn, matches);
            case "AssignmentExpression":
            case "BinaryExpression":
                status = this.filterNestedNode(node.left, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.right, fn, matches);
                return status;
            case "CallExpression":
                status = this.filterNestedNode(node.callee, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.arguments, fn, matches);
                return status;
            case "ConditionalExpression":
                status = this.filterNestedNode(node.test, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.consequent, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.alternate, fn, matches);
                return status;
            case "ContinueCaseStatement":
                break;
            case "ContinueLoopStatement":
                return this.filterNestedNode(node.level, fn, matches);
            case "DoWhileStatement":
                status = this.filterNestedNode(node.test, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.body, fn, matches);
                return status;
            case "ElseIfStatement":
                status = this.filterNestedNode(node.test, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.consequent, fn, matches);
                return status;
            case "ElseStatement":
                return this.filterNestedNodes(node.consequent, fn, matches);
            case "EmptyStatement":
                break;
            case "EnumDeclaration":
                return this.filterNestedNodes(node.declarations, fn, matches);
            case "ExitLoopStatement":
                return this.filterNestedNode(node.level, fn, matches);
            case "ExitStatement":
                return this.filterNestedNode(node.argument, fn, matches);
            case "ExpressionStatement":
                return this.filterNestedNode(node.expression, fn, matches);
            case "ForInStatement":
                status = this.filterNestedNode(node.left, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.right, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.body, fn, matches);
                return status;
            case "ForStatement":
                status = this.filterNestedNode(node.init, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.test, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.update, fn, matches)
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.body, fn, matches);
                return status;
            case "FunctionDeclaration":
                //FIXME: the fix made here should be made for all multi property nodes cases, here and in other filter functions.
                //FIXME: assert status and return the most relevant or stop when reaching stop enum values and return that?
                status = this.filterNestedNode(node.id, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.params, fn, matches)
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.body, fn, matches);
                return status;
            case "Identifier":
                break;
            case "IfStatement":
                status = this.filterNestedNode(node.test, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = Array.isArray(node.consequent) ? this.filterNestedNodes(node.consequent, fn, matches) : this.filterNestedNode(node.consequent, fn, matches)
                if ('alternate' in node ) {
                    if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                        return status;
                    }
                    status = this.filterNestedNodes(node.alternate, fn, matches);
                }
                return status;
            case "IncludeOnceStatement":
                break;
            case "IncludeStatement":
                break;
            case "Keyword":
                break;
            case "Literal":
                break;
            case "LogicalExpression":
                status = this.filterNestedNode(node.left, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.right, fn, matches);
                return status;
            case "Macro":
                break;
            case "MemberExpression":
                status = this.filterNestedNode(node.object, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.property, fn, matches);
                return status;
            case "MultiLineComment":
                break;
            case "NotExpression":
                return this.filterNestedNode(node.value, fn, matches);
            case "Parameter":
                status = this.filterNestedNode(node.id, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.init, fn, matches);
                return status;
            case "PreProcStatement":
                break;
            case "RedimExpression":
                //return this.filterNestedNodes(node.declarations, line, column);
                //NOTE: redim ts type is not implemented as of writing this code iteration, and not needed for current intellisense anyways.
                //TODO: implement at a later date, for hover support on the variables, and more.
                break;
            case "ReturnStatement":
                return this.filterNestedNode(node.value, fn, matches);
            case "SelectCase":
                status = this.filterNestedNode(node.tests, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.consequent, fn, matches);
                return status;
            case "SelectStatement":
                return this.filterNestedNodes(node.cases, fn, matches);
            case "SingleLineComment":
                break;
            case "SwitchCase":
                status = this.filterNestedNodes(node.tests, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.consequent, fn, matches);
                return status;
            case "SwitchCaseRange":
                status = this.filterNestedNode(node.from, fn, matches)
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.to, fn, matches);
                return status;
            case "SwitchStatement":
                status = this.filterNestedNode(node.discriminant, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.cases, fn, matches);
                return status;
            case "UnaryExpression":
                return this.filterNestedNode(node.argument, fn, matches)
            case "VariableDeclaration":
                return this.filterNestedNodes(node.declarations, fn, matches);
            case "VariableDeclarator":
                status = this.filterNestedNode(node.id, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNode(node.init, fn, matches);
                return status;
            case "VariableIdentifier":
                break;
            case "WhileStatement":
                status = this.filterNestedNode(node.test, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.body, fn, matches);
                return status;
            case "WithStatement":
                status = this.filterNestedNode(node.object, fn, matches);
                if (status === NodeFilterAction.Stop || status === NodeFilterAction.StopAndSkip) {
                    return status;
                }
                status = this.filterNestedNodes(node.body, fn, matches);
                return status;
            default:
                //@ts-expect-error
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
     * @param functions Function map for fallback lookups
     * @param depth Recursive depth tracking variable
     */
    public getIdentifierDeclarator(identifier: IdentifierName | VariableIdentifier | Macro | null, stack: string[] = [], functions: FunctionDeclaration[] = [], depth: number = 0): FormalParameter | FunctionDeclaration | VariableDeclaration | EnumDeclaration | null {
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

        let declaration: FormalParameter | FunctionDeclaration | VariableDeclaration | EnumDeclaration | undefined | null;

        switch (identifier.type) {
            case "Identifier":
                declaration = this.declarations.find((declaration) => declaration.type === "FunctionDeclaration" && declaration.id.name.toLowerCase() === identifier.name.toLowerCase());

                if ((declaration == null) && this.workspace !== undefined) {
                    for (const include of this.includes) {
                        if (include.uri !== null) {
                            declaration = this.workspace.get(include.uri)?.getIdentifierDeclarator(identifier, stack, functions, depth + 1);
                            if (declaration !== null && declaration !== undefined) {
                                break;
                            }
                        }
                    }
                }
                break;
            case "VariableIdentifier":
                if (stack.length === 1) { //if length is 1, we are in the same file, as the initial identifier
                    const nodesAtPosition = this.getNodesAt(identifier.location.start.line, identifier.location.start.column);
                    //Check if we are within a function
                    if (nodesAtPosition[0]?.type === "FunctionDeclaration") {
                        if (identifier.type === "VariableIdentifier") {
                            //check function parameters
                            declaration = declaration ?? nodesAtPosition[0].params.find((parameter) => parameter.id.name.toLowerCase() === identifier.name.toLowerCase());

                            //check lines/column BEFORE the node
                            if ((declaration??null) === null) {
                                let matches = [];
                                this.filterNestedNode(nodesAtPosition[0], (node) => (node.type === "VariableDeclarator" && node.id.name.toLowerCase() === identifier.name.toLowerCase() && identifier.location.start.offset >= node.location.start.offset) ? NodeFilterAction.Stop : NodeFilterAction.Skip, matches);
                                declaration = matches[0];
                            }
                        }
                    }
                }

                if ((declaration??null) === null) {
                    //Global lookup
                    const matches: Array<VariableDeclaration> = [];
                    this.filterNestedNodes(this.program?.body ?? null, (node) => {
                        if (node.type === "FunctionDeclaration") {
                            functions.push(node);
                            return NodeFilterAction.SkipAndStopPropagation;
                        }

                        if (node.type === "VariableDeclarator" && (node.location.source !== identifier.location.source || node.location.start.offset <= identifier.location.start.offset)) {
                            if (node.id.name.toLowerCase() === identifier.name.toLowerCase()) {
                                return NodeFilterAction.Stop;
                            }
                        }

                        if (node.type === "IncludeStatement" && this.workspace !== undefined) {
                            let uri = this.includes.find((include) => include.statement.file === node.file && include.statement.library === node.library)?.uri;
                            if (typeof uri === "string") {
                                declaration = this.workspace.get(uri)?.getIdentifierDeclarator(identifier, stack, functions, depth + 1);
                                if ((declaration??null) !== null) {
                                    return NodeFilterAction.StopAndSkip;
                                }
                            }
                        }

                        return NodeFilterAction.Skip;
                    }, matches);
                    if ((declaration??null) === null) {
                        declaration = matches[0];
                    }
                    if ((declaration??null) === null && depth === 0) {
                        this.filterNestedNodes(functions, (node) => {
                            switch (node.type) {
                                case "VariableDeclaration":
                                    return (node.scope?.toLowerCase() === "global") ? NodeFilterAction.Skip : NodeFilterAction.SkipAndStopPropagation;
                                case "VariableDeclarator":
                                    if (node.id.name.toLowerCase() === identifier.name.toLowerCase()) {
                                        declaration = node;
                                        return NodeFilterAction.StopAndSkip;
                                    }
                                    return NodeFilterAction.Skip;
                                case "FunctionDeclaration":
                                    return NodeFilterAction.Skip;
                                default:
                                    return NodeFilterAction.SkipAndStopPropagation;
                            }
                        }, []);
                    }
                }
                break;
            default:
                const exhaustiveCheck: never = identifier;
                //@ts-expect-error
                throw new Error(`Unhandled identifier type: ${exhaustiveCheck?.type}`);
        }

        return declaration ?? null;
    }

    public getIncludes(): Readonly<Array<Include>> {
        return this.includes;
    }

    public getText(location?: LocationRange): string {
        if (location === undefined) {
            return this.text;
        }

        return this.text.slice(location.start.offset, location.end.offset);
    }
}
