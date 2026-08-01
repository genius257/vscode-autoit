import parser, { type AutoIt3, type LocationRange } from 'autoit3-pegjs';
import { Diagnostic, DiagnosticSeverity, /* DiagnosticTag,*/ Position } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import * as Parser from './Parser';
import { Workspace } from './Workspace';
import * as PositionHelper from './PositionHelper';
import debounce from '@utils/debounce';
import FqsenResolver from './docBlock/FqsenResolver';
import StandardTagFactory from './docBlock/DocBlock/StandardTagFactory';
import MarkdownDescriptionFactory from './docBlock/DocBlock/MarkdownDescriptionFactory';
import DocBlockFactory from './docBlock/DocBlockFactory';
import AstWalker from './AstWalker';
import Symbol, { Declaration, Node as SymbolNode } from './Symbol';
import Scope from './Scope';

export type Include = {
    /** Resolved include statement URI path */
    promise: Promise<string | null>,
    uri: string | null,
    statement: AutoIt3.IncludeStatement,
};

export type ScriptError = Diagnostic
    & { severity: typeof DiagnosticSeverity.Error };

export type ScriptWarning = Diagnostic
    & { severity: typeof DiagnosticSeverity.Warning };

export type ScriptInformation = Diagnostic
    & { severity: typeof DiagnosticSeverity.Information };

export type ScriptHint = Diagnostic
    & { severity: typeof DiagnosticSeverity.Hint };

export type ScriptDiagnostic =
    | ScriptError
    | ScriptWarning
    | ScriptInformation
    | ScriptHint;

export type Node =
    | AutoIt3.SourceElement
    | AutoIt3.StatementInWith
    | AutoIt3.AssignmentExpression
    | AutoIt3.AssignmentExpressionInWith
    | AutoIt3.FormalParameter
    | AutoIt3.VariableStatement
    | AutoIt3.VariableStatementInWith
    | AutoIt3.VariableDeclaration
    | AutoIt3.VariableDeclarationInWith
    | AutoIt3.EnumDeclaration
    | AutoIt3.EnumDeclarationInWith
    | AutoIt3.ArrayDeclaration
    | AutoIt3.ArrayDeclarationInWith
    | AutoIt3.DefaultClause
    | AutoIt3.DefaultClauseInWith
    | AutoIt3.CaseClause
    | AutoIt3.CaseClauseInWith
    | AutoIt3.SelectCaseClause
    | AutoIt3.SelectCaseClauseInWith
    | AutoIt3.SwitchCaseValue
    | AutoIt3.SwitchCaseValueInWith
    | AutoIt3.Macro
    | AutoIt3.IncludeStatement
    | AutoIt3.IfStatement
    | AutoIt3.IfStatementInWith
    | AutoIt3.ElseIfClause
    | AutoIt3.ElseIfClauseInWith
    | AutoIt3.ElseClause
    | AutoIt3.ElseClauseInWith;

export type NodeList =
    | AutoIt3.StatementList
    | AutoIt3.StatementListInWith
    | AutoIt3.SourceElement[]
    | AutoIt3.ArgumentList
    | AutoIt3.ArgumentListInWith
    | AutoIt3.VariableDeclarationList
    | AutoIt3.VariableDeclarationListInWith
    | AutoIt3.EnumDeclarationList
    | AutoIt3.EnumDeclarationListInWith
    | AutoIt3.FormalParameterList
    | (AutoIt3.DefaultClause | AutoIt3.CaseClause | AutoIt3.SelectCaseClause)[]
    | (AutoIt3.DefaultClauseInWith | AutoIt3.CaseClauseInWith | AutoIt3.SelectCaseClauseInWith)[]
    | AutoIt3.ArrayDeclarationElementList
    | AutoIt3.ArrayDeclarationElementListInWith
    | AutoIt3.CaseValueList
    | AutoIt3.CaseValueListInWith
    | AutoIt3.ElseIfClauses
    | AutoIt3.ElseIfClausesInWith
    | AutoIt3.ElseClause[]
    | AutoIt3.ElseClauseInWith[]
    | (AutoIt3.ElseClause | AutoIt3.ElseIfClause)[]
    | (AutoIt3.ElseClauseInWith | AutoIt3.ElseIfClauseInWith)[]
    | AutoIt3.FunctionDeclaration[];

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
}

export default class Script {
    public workspace: Workspace | undefined;
    protected uri: URI | undefined;
    protected text: string;

    // Diagnostics
    protected errors: ScriptError[] = [];
    protected warnings: ScriptWarning[] = [];
    protected informations: ScriptInformation[] = [];
    protected hints: ScriptHint[] = [];

    /** A cache of all currently resolved include statements, for the current script instance */
    protected includeCache: Include[] = [];// FIXME: if script is moved, this needs to be cleared.
    protected includes: Include[] = [];

    /** Reference count */
    protected refCount: number = 1;

    protected program: AutoIt3.Program | undefined;
    protected scope: Scope = new Scope();

    constructor(
        text: string,
        uri?: URI,
        workspace: Workspace | undefined = undefined,
    ) {
        this.uri = uri;
        this.workspace = workspace;
        this.text = text;
        this.parseText(text);
    }

    public getDiagnostics(): Diagnostic[] {
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
                this.workspace?.eventEmitter.emit(
                    'diagnostics',
                    {
                        uri: this.uri.toString(),
                        diagnostics: this.getDiagnostics(),
                    },
                );
            }
        }, 100);

        this.debouncedTriggerDiagnostics();
    }

    protected parseText(text: string) {
        try {
            this.program = parser.parse(
                text,
                { grammarSource: this.uri?.toString() },
            );

            this.analyze();
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
         * if (0 >= --this.refCount) {
         *   if (this.uri !== undefined) {
         *       this.workspace?.remove(this.uri);
         *   }
         *   this.workspace = undefined;
         *   this.resetDiagnostics();
         * }
         */

        return this.refCount;
    }

    public analyze() {
        /*
         * Variables for holding symbols that need to be processed after all symbols is collected.
         * For example: assignments without a scope. They need to be checked afterwards, to verify if they belong in a global or local scope.
         */
        const assignmentsInScope: { node: { id: SymbolNode, location: LocationRange }, scope: Scope }[] = [];
        const referencesInScope: { node: SymbolNode, scope: Scope }[] = [];

        const declarations: Declaration[] = [];
        const references: Symbol[] = [];

        /** Holds potential docblock comment(s) between non comment nodes */
        let relatedComments: AutoIt3.MultiLineComment | AutoIt3.SingleLineComment[] | null = null;
        let scope = new Scope(
            // FIXME: AutoIt.program is currently missing location property
            PositionHelper.rangeToLocationRange({ start: { character: 0, line: 0 }, end: { character: 0, line: 0 } }),
            this.uri,
        );

        const fqsenResolver = new FqsenResolver();
        const tagFactory =
            new StandardTagFactory(fqsenResolver);
        const descriptionFactory =
            new MarkdownDescriptionFactory(tagFactory);
        const docBlockFactory =
            new DocBlockFactory(
                descriptionFactory,
                tagFactory,
            );

        const processNode = (node: Node): NodeFilterAction => {
            switch (node.type) {
                case 'FunctionDeclaration':
                    scope.addDeclaration(node.id);

                    if (relatedComments !== null) {
                        if (Array.isArray(relatedComments)) {
                            const x = docBlockFactory.createFromLegacyComments(relatedComments);

                            if (x !== null) {
                                scope.getSymbol(Symbol.getNodeName(node.id))?.addDocblock(node.id, x);
                            }
                        } else {
                            const x = docBlockFactory.createFromMultilineComment(relatedComments);
                            scope.getSymbol(Symbol.getNodeName(node.id))?.addDocblock(node.id, x);
                        }
                    }

                    processFunctionNode(node);

                    return NodeFilterAction.SkipAndStopPropagation;
                case 'SingleLineComment':
                    if (Array.isArray(relatedComments)) {
                        relatedComments.push(node);
                    }

                    relatedComments = [node];

                    return NodeFilterAction.Skip;
                case 'MultiLineComment':
                    relatedComments = node;

                    return NodeFilterAction.Skip;
                case 'EnumDeclaration':
                    node.declarations.forEach((enumDeclaration) => {
                        if (scope.isGlobal()) {
                            scope.addDeclaration(enumDeclaration.id);
                        } else if (node.scope !== null) {
                            (node.scope === 'local' ? scope : scope.parent!).addDeclaration(
                                enumDeclaration.id,
                            );
                        } else {
                            assignmentsInScope.push({
                                node: enumDeclaration,
                                scope,
                            });
                        }

                        AstWalker.filterNestedNode(enumDeclaration.init, processNode, []);
                    });

                    relatedComments = null;

                    return NodeFilterAction.SkipAndStopPropagation;
                case 'Parameter':
                    scope.addDeclaration(node.id);

                    return NodeFilterAction.Skip;
                case 'ForStatement':
                    // node.body
                    break;
                case 'VariableDeclaration':
                    node.declarations.forEach((declaration) => {
                        scope.addDeclaration(declaration.id);
                    });

                    return NodeFilterAction.Skip;
                case 'VariableIdentifier':
                    if (scope.parent === null || scope.getSymbol(Symbol.getNodeName(node))?.getDeclarations().size) {
                        scope.addReference(node);
                    } else {
                        referencesInScope.push({
                            node,
                            scope,
                        });
                    }

                    break;
                case 'CallExpression':
                    switch (node.callee.type) {
                        case 'Identifier':
                            switch (node.callee.name.toLowerCase()) {
                                case 'assign':
                                    {
                                        const arg0 = node.arguments[0];

                                        if (arg0.type !== 'Literal') {
                                            break;
                                        }

                                        if (typeof arg0.value !== 'string') {
                                            break;
                                        }

                                        // FIXME: declaration missing a symbol?
                                        // const declaration = new Declaration(node.callee);

                                        // declarations.push(declaration);
                                    }

                                    break;
                                case 'eval':
                                case 'call':
                                    {
                                        const arg0 = node.arguments[0];

                                        if (arg0.type !== 'Literal') {
                                            break;
                                        }

                                        if (typeof arg0.value !== 'string') {
                                            break;
                                        }

                                        // FIXME: scope
                                        const reference = new Symbol(node.callee);

                                        references.push(reference);
                                    }

                                    break;
                                case 'execute':
                                    {
                                        const arg0 = node.arguments[0];

                                        if (arg0.type !== 'Literal') {
                                            break;
                                        }

                                        if (typeof arg0.value !== 'string') {
                                            break;
                                        }

                                        const ast = parser.parse(arg0.value);

                                        AstWalker.filterNestedNodes(ast.body, processNode, []);
                                    }

                                    break;
                                default:
                                    break;
                            }

                            (scope.parent ?? scope).addReference(node.callee);

                            break;
                    }

                    break;
                default:
                    break;
            }

            relatedComments = null;

            return NodeFilterAction.Skip;
        };

        const processFunctionNode = (node: AutoIt3.FunctionDeclaration) => {
            const declaration = new Declaration({
                name: node.id.name,
                docBlock: relatedComments === null ? undefined : Array.isArray(relatedComments) ? docBlockFactory.createFromLegacyComments(relatedComments) ?? undefined : docBlockFactory.createFromMultilineComment(relatedComments),
                range: node.location,
                scope: scope,
                type: 'function',
                uri: this.uri,
            });

            const originalScope = scope;
            const functionScope = new Scope(node.location, this.uri, originalScope);

            scope.addSubscope(functionScope);

            relatedComments = null;
            scope = functionScope;

            AstWalker.filterNestedNodes(node.params, processNode, []);
            AstWalker.filterNestedNodes(node.body, processNode, []);

            scope = originalScope;

            declarations.push(declaration);
        };

        AstWalker.filterNestedNodes(this.program?.body ?? [], processNode, []);

        // const previousIncludes = this.includes;
        const currrentIncludes: AutoIt3.IncludeStatement[] | undefined = this.program?.body.filter((node): node is AutoIt3.IncludeStatement => node.type === 'IncludeStatement') as AutoIt3.IncludeStatement[] | undefined;

        // function for comparing include statements
        const includeStatementComparator = (
            a: AutoIt3.IncludeStatement,
            b: AutoIt3.IncludeStatement,
        ): boolean => {
            return a.file === b.file && a.library === b.library;
        };

        // const detached = previousIncludes.filter(previous => currrentIncludes?.findIndex(current => previous.statement.file === current.file && previous.statement.library === current.library) === -1);

        // const added = currrentIncludes?.filter(current => previousIncludes?.findIndex(previous => previous.statement.file === current.file && previous.statement.library === current.library) === -1);

        // Get the detached includes
        const detached = this.includes.filter(
            (include) => currrentIncludes?.findIndex(
                (current) => includeStatementComparator(
                    include.statement,
                    current,
                ),
            ) === -1,
        );

        // release the detached includes
        detached.forEach((include) => {
            include.promise.then((value) => {
                if (value !== null) {
                    this.workspace?.get(value)?.release();
                }
            });
        });

        // Update the list of includes
        this.includes = currrentIncludes?.map((include) => {
            // Check if the include statement is already cached
            const cached = this.includeCache.find(
                (cacheItem) => cacheItem.statement.file === include.file &&
                    cacheItem.statement.library === include.library,
            );

            // If it is, use the cached version
            if (cached !== undefined) {
                cached.statement = include;
                cached.promise.then((value) => {
                    if (value !== null) {
                        this.workspace?.get(value)?.addReference();
                    }
                });

                return cached;
            }

            // If not, create a new include, and add it to the cache
            const newInclude = this.createInclude(include);
            this.includeCache.push(newInclude);

            return newInclude;
        }) ?? [];

        // Report includes that could not be resolved to the user
        this.includes.forEach((include) => include.promise.then((value) => {
            if (value === null) {
                this.addError({
                    message: `Could not resolve include: '${include.statement.file}'`,
                    range: PositionHelper.locationRangeToRange(
                        include.statement.location,
                    ),
                });

                // return;
            }

            /*
             * // FIXME: currently this will not trigger when opening a file with includes that have errors, since the included file is not yet parsed.
             * // To fix this we need to subscribe to the included file's diagnostics.
             * // This should not be implemented yet, before the parser is fully compatible with AutoIt, as it currently reports false positives for some edge cases and have not implemented the with statement yet.
             *
             * //@ts-expect-error
             * const severity = this.workspace?.get(value)?.getDiagnostics().reduce((acc, diagnostic) => {
             *     return acc === undefined || diagnostic.severity === undefined || diagnostic.severity < acc ? diagnostic.severity : acc;
             * }, undefined);
             *
             * let highestSeverity: undefined | DiagnosticSeverity = undefined;
             * const relatedDiagnostics = this.workspace?.get(value)?.getDiagnostics().filter(diagnostic => {
             *    if (diagnostic.severity === undefined || diagnostic.severity > DiagnosticSeverity.Warning) {
             *        return false;
             *    }
             *    highestSeverity = highestSeverity === undefined || diagnostic.severity < highestSeverity ? diagnostic.severity : highestSeverity;
             *    return diagnostic.severity === highestSeverity;
             * }) ?? [];
             *
             * if (highestSeverity !== undefined) {
             *  const errorCount = relatedDiagnostics.filter(diagnostic => diagnostic.severity === DiagnosticSeverity.Error).length;
             *  const warningCount = relatedDiagnostics.filter(diagnostic => diagnostic.severity === DiagnosticSeverity.Warning).length;
             *    const diagnosticStrings = [errorCount > 0 ? `${errorCount} error${errorCount > 1 ? 's' : ''}` : null, warningCount > 0 ?`${warningCount} warning${warningCount > 1 ? 's' : ''}` : null].filter(value => value !== null);
             *    this.addDiagnostic({
             *        severity: highestSeverity,
             *        message: `${diagnosticStrings.join(' and ')} were found in '${include.statement.file}'`,
             *        range: PositionHelper.locationRangeToRange(include.statement.location),
             *        relatedInformation: relatedDiagnostics.map(diagnostic => {
             *            return {
             *                location: {uri: value, range: diagnostic.range},
             *                message: diagnostic.message,
             *            };
             *        })
             *    });
             * }
             */
        }));

        this.scope = scope;
    }

    public createInclude(include: AutoIt3.IncludeStatement): Include {
        const _include: Include = {
            statement: include,
            uri: null,
            promise: this.workspace?.resolveInclude(include).then(
                (value) => value?.uri.toString() ?? null,
            ) ?? Promise.resolve(null),
        };

        _include.promise.then((value) => _include.uri = value);

        return _include;
    }

    public updateContent() {
        throw new Error('Not implemented');// FIXME: implement
    }

    /**
     * Adds diagnostic information to the current script and broadcast it to subscribers
     */
    public addDiagnostic(diagnostic: ScriptDiagnostic) {
        const severity = diagnostic.severity;
        let diagnosticArray: Diagnostic[] | undefined;

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

        /*
         * <message>. <source>(<code>)
         * If codeDescription href is set, code will be wrapped in a link with that href
         * diagnostic.code = "code";
         */
        /*
         * diagnostic.codeDescription = {
         *   href: "https://example.com",
         * };
         */

        // diagnostic.source = "source";

        // diagnostic.tags = [DiagnosticTag.Unnecessary, DiagnosticTag.Deprecated];

        diagnostic.source ??= 'AutoIt';

        diagnosticArray.push(diagnostic);
        this.triggerDiagnostics();
    }

    public addError(error: Omit<ScriptError, 'severity'> & Partial<Pick<ScriptError, 'severity'>>) {
        this.addDiagnostic({
            ...error,
            severity: DiagnosticSeverity.Error,
        });
    }

    public addWarning(warning: Omit<ScriptWarning, 'severity'> & Partial<Pick<ScriptWarning, 'severity'>>) {
        this.addDiagnostic({
            ...warning,
            severity: DiagnosticSeverity.Warning,
        });
    }

    public addInformation(information: Omit<ScriptInformation, 'severity'> & Partial<Pick<ScriptInformation, 'severity'>>) {
        this.addDiagnostic({
            ...information,
            severity: DiagnosticSeverity.Information,
        });
    }

    public addHint(hint: Omit<ScriptHint, 'severity'> & Partial<Pick<ScriptHint, 'severity'>>) {
        this.addDiagnostic({
            ...hint,
            severity: DiagnosticSeverity.Hint,
        });
    }

    public getUri(): URI | undefined {
        return this.uri;
    }

    public getNodesAt(position: Position): Node[];
    public getNodesAt(line: number, column: number): Node[];
    public getNodesAt(line: Position | number, column: number = 0): Node[] {
        if (typeof line !== 'number') {
            const location = PositionHelper.positionToLocation(line);
            column = location.column;
            line = location.line;
        }

        return this.getNestedNodesAtFromArray(
            this.program?.body ?? null,
            line,
            column,
            [],
        );
    }

    // FIXME: move this to a helper file
    protected assertCannotReach(x: never, message: string = 'Unexpected unreachable code reached.'): never {
        throw new Error(message);
    }

    /** @internal */
    public getNestedNodesAt(
        node: Node | null,
        line: number,
        column: number,
        matches: Node[],
    ): Node[] {
        if (node === null) {
            return matches;
        }

        if (node.location === undefined) {
            throw new Error('location is undefined on node type: ' + node.type);
        }

        // FIXME: add inline documentation for the "MemberExpression" case

        // FIXME: "CallExpression" case exists because nested call expressions have a bug with the wrapping expression position only covering the trailing parentheses. The fix need to be implemented in the parser.
        if (node.type !== 'MemberExpression' && node.type !== 'CallExpression' && !Parser.isPositionWithinLocation(line, column, node.location)) {
            return matches;
        }

        matches.push(node);

        const type = node.type;

        switch (type) {
            case 'ArrayDeclaration':
                return this.getNestedNodesAtFromArray(
                    node.elements,
                    line,
                    column,
                    matches,
                );
            case 'AssignmentExpression':
            case 'BinaryExpression':
                this.getNestedNodesAt(node.left, line, column, matches);
                this.getNestedNodesAt(node.right, line, column, matches);

                break;
            case 'CallExpression':
                this.getNestedNodesAt(node.callee, line, column, matches);
                this.getNestedNodesAtFromArray(
                    node.arguments,
                    line,
                    column,
                    matches,
                );

                break;
            case 'ConditionalExpression':
                this.getNestedNodesAt(node.test, line, column, matches);
                this.getNestedNodesAt(node.consequent, line, column, matches);
                this.getNestedNodesAt(node.alternate, line, column, matches);

                break;
            case 'ContinueCaseStatement':
                break;
            case 'ContinueLoopStatement':
                return this.getNestedNodesAt(node.level, line, column, matches);
            case 'DoWhileStatement':
                this.getNestedNodesAt(node.test, line, column, matches);
                this.getNestedNodesAtFromArray(
                    node.body,
                    line,
                    column,
                    matches,
                );

                break;
            case 'ElseIfStatement':
                this.getNestedNodesAt(node.test, line, column, matches);
                this.getNestedNodesAtFromArray(
                    node.consequent,
                    line,
                    column,
                    matches,
                );

                break;
            case 'ElseStatement':
                this.getNestedNodesAtFromArray(
                    node.consequent,
                    line,
                    column,
                    matches,
                );

                break;
            case 'EmptyStatement':
                break;
            case 'EnumDeclaration':
                return this.getNestedNodesAtFromArray(
                    node.declarations,
                    line,
                    column,
                    matches,
                );
            case 'ExitLoopStatement':
                return this.getNestedNodesAt(node.level, line, column, matches);
            case 'ExitStatement':
                return this.getNestedNodesAt(
                    node.argument,
                    line,
                    column,
                    matches,
                );
            case 'ExpressionStatement':
                return this.getNestedNodesAt(
                    node.expression,
                    line,
                    column,
                    matches,
                );
            case 'ForInStatement':
                this.getNestedNodesAt(node.left, line, column, matches);
                this.getNestedNodesAt(node.right, line, column, matches);
                this.getNestedNodesAtFromArray(
                    node.body,
                    line,
                    column,
                    matches,
                );

                break;
            case 'ForStatement':
                this.getNestedNodesAt(node.init, line, column, matches);
                this.getNestedNodesAt(node.test, line, column, matches);
                this.getNestedNodesAt(node.update, line, column, matches);
                this.getNestedNodesAtFromArray(
                    node.body,
                    line,
                    column,
                    matches,
                );

                break;
            case 'FunctionDeclaration':
                this.getNestedNodesAt(node.id, line, column, matches);
                this.getNestedNodesAtFromArray(
                    node.params,
                    line,
                    column,
                    matches,
                );
                this.getNestedNodesAtFromArray(
                    node.body,
                    line,
                    column,
                    matches,
                );

                break;
            case 'Identifier':
                break;
            case 'IfStatement':
                this.getNestedNodesAt(node.test, line, column, matches);
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                Array.isArray(node.consequent)
                    ? this.getNestedNodesAtFromArray(
                        node.consequent,
                        line,
                        column,
                        matches,
                    )
                    : this.getNestedNodesAt(
                        node.consequent,
                        line,
                        column,
                        matches,
                    );

                if ('alternate' in node) {
                    this.getNestedNodesAtFromArray(
                        node.alternate,
                        line,
                        column,
                        matches,
                    );
                }

                break;
            case 'IncludeOnceStatement':
                break;
            case 'IncludeStatement':
                break;
            case 'Keyword':
                break;// FIXME: return keywords also?
            case 'Literal':
                break;
            case 'LogicalExpression':
                this.getNestedNodesAt(node.left, line, column, matches);
                this.getNestedNodesAt(node.right, line, column, matches);

                break;
            case 'Macro':
                break;
            case 'MemberExpression':
                this.getNestedNodesAt(node.object, line, column, matches);
                this.getNestedNodesAt(node.property, line, column, matches);

                break;
            case 'MultiLineComment':
                break;
            case 'Parameter':
                this.getNestedNodesAt(node.id, line, column, matches);
                this.getNestedNodesAt(node.init, line, column, matches);

                break;
            case 'ParenthesizedExpression':
                this.getNestedNodesAt(node.expression, line, column, matches);

                break;
            case 'PreProcStatement':
                break;
            case 'RedimExpression':
                // return this.getNestedNodesAtFromArray(node.declarations, line, column);

                // NOTE: redim ts type is not implemented as of writing this code iteration, and not needed for current intellisense anyways.

                // TODO: implement at a later date, for hover support on the variables, and more.
                break;
            case 'ReturnStatement':
                return this.getNestedNodesAt(node.value, line, column, matches);
            case 'SelectCase':
                this.getNestedNodesAt(node.tests, line, column, matches);
                this.getNestedNodesAtFromArray(
                    node.consequent,
                    line,
                    column,
                    matches,
                );

                break;
            case 'SelectStatement':
                return this.getNestedNodesAtFromArray(
                    node.cases,
                    line,
                    column,
                    matches,
                );
            case 'SingleLineComment':
                break;
            case 'SwitchCase':
                this.getNestedNodesAtFromArray(
                    node.tests,
                    line,
                    column,
                    matches,
                );
                this.getNestedNodesAtFromArray(
                    node.consequent,
                    line,
                    column,
                    matches,
                );

                break;
            case 'SwitchCaseRange':
                this.getNestedNodesAt(node.from, line, column, matches);
                this.getNestedNodesAt(node.to, line, column, matches);

                break;
            case 'SwitchStatement':
                this.getNestedNodesAt(node.discriminant, line, column, matches);
                this.getNestedNodesAtFromArray(
                    node.cases,
                    line,
                    column,
                    matches,
                );

                break;
            case 'UnaryExpression':
                return this.getNestedNodesAt(
                    node.argument,
                    line,
                    column,
                    matches,
                );
            case 'VariableDeclaration':
                return this.getNestedNodesAtFromArray(
                    node.declarations,
                    line,
                    column,
                    matches,
                );
            case 'VariableDeclarator':
                this.getNestedNodesAt(node.id, line, column, matches);
                this.getNestedNodesAt(node.init, line, column, matches);

                break;
            case 'VariableIdentifier':
                break;
            case 'WhileStatement':
                this.getNestedNodesAt(node.test, line, column, matches);
                this.getNestedNodesAtFromArray(
                    node.body,
                    line,
                    column,
                    matches,
                );

                break;
            case 'WithStatement':
                this.getNestedNodesAt(node.object, line, column, matches);
                this.getNestedNodesAtFromArray(
                    node.body,
                    line,
                    column,
                    matches,
                );

                break;
            default:
                this.assertCannotReach(node, `Unsupported node type: "${type}"`);
        }

        return matches;
    }

    /** @internal */
    protected getNestedNodesAtFromArray(
        nodeList: NodeList | null,
        line: number,
        column: number,
        matches: Node[],
    ): Node[] {
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
    filterNodes(fn: (node: Node) => NodeFilterAction | never): Node[] {
        const matches: Node[] = [];
        this.filterNestedNodes(this.program?.body ?? null, fn, matches);

        return matches;
    }

    filterNestedNode(
        node: Node | null,
        fn: (node: Node) => NodeFilterAction | never,
        matches: Node[],
    ): NodeFilterAction {
        if (node === null) {
            return NodeFilterAction.Skip;
        }

        switch (fn(node)) {
            case NodeFilterAction.Continue:
                matches.push(node);

                break;
            case NodeFilterAction.Skip:
                // Do nothing.
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
            case 'ArrayDeclaration':
                return this.filterNestedNodes(node.elements, fn, matches);
            case 'AssignmentExpression':
            case 'BinaryExpression':
                status = this.filterNestedNode(node.left, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.right, fn, matches);

                return status;
            case 'CallExpression':
                status = this.filterNestedNode(node.callee, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.arguments, fn, matches);

                return status;
            case 'ConditionalExpression':
                status = this.filterNestedNode(node.test, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.consequent, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.alternate, fn, matches);

                return status;
            case 'ContinueCaseStatement':
                break;
            case 'ContinueLoopStatement':
                return this.filterNestedNode(node.level, fn, matches);
            case 'DoWhileStatement':
                status = this.filterNestedNode(node.test, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.body, fn, matches);

                return status;
            case 'ElseIfStatement':
                status = this.filterNestedNode(node.test, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.consequent, fn, matches);

                return status;
            case 'ElseStatement':
                return this.filterNestedNodes(node.consequent, fn, matches);
            case 'EmptyStatement':
                break;
            case 'EnumDeclaration':
                return this.filterNestedNodes(node.declarations, fn, matches);
            case 'ExitLoopStatement':
                return this.filterNestedNode(node.level, fn, matches);
            case 'ExitStatement':
                return this.filterNestedNode(node.argument, fn, matches);
            case 'ExpressionStatement':
                return this.filterNestedNode(node.expression, fn, matches);
            case 'ForInStatement':
                status = this.filterNestedNode(node.left, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.right, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.body, fn, matches);

                return status;
            case 'ForStatement':
                status = this.filterNestedNode(node.init, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.test, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.update, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.body, fn, matches);

                return status;
            case 'FunctionDeclaration':
                // FIXME: the fix made here should be made for all multi property nodes cases, here and in other filter functions.

                // FIXME: assert status and return the most relevant or stop when reaching stop enum values and return that?
                status = this.filterNestedNode(node.id, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.params, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.body, fn, matches);

                return status;
            case 'Identifier':
                break;
            case 'IfStatement':
                status = this.filterNestedNode(node.test, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = Array.isArray(node.consequent)
                    ? this.filterNestedNodes(node.consequent, fn, matches)
                    : this.filterNestedNode(node.consequent, fn, matches);

                if ('alternate' in node) {
                    if (
                        status === NodeFilterAction.Stop ||
                        status === NodeFilterAction.StopAndSkip
                    ) {
                        return status;
                    }

                    status = this.filterNestedNodes(
                        node.alternate,
                        fn,
                        matches,
                    );
                }

                return status;
            case 'IncludeOnceStatement':
                break;
            case 'IncludeStatement':
                break;
            case 'Keyword':
                break;
            case 'Literal':
                break;
            case 'LogicalExpression':
                status = this.filterNestedNode(node.left, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.right, fn, matches);

                return status;
            case 'Macro':
                break;
            case 'MemberExpression':
                status = this.filterNestedNode(node.object, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.property, fn, matches);

                return status;
            case 'MultiLineComment':
                break;
            case 'Parameter':
                status = this.filterNestedNode(node.id, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.init, fn, matches);

                return status;
            case 'ParenthesizedExpression':
                return this.filterNestedNode(node.expression, fn, matches);
            case 'PreProcStatement':
                break;
            case 'RedimExpression':
                // return this.filterNestedNodes(node.declarations, line, column);

                // NOTE: redim ts type is not implemented as of writing this code iteration, and not needed for current intellisense anyways.

                // TODO: implement at a later date, for hover support on the variables, and more.
                break;
            case 'ReturnStatement':
                return this.filterNestedNode(node.value, fn, matches);
            case 'SelectCase':
                status = this.filterNestedNode(node.tests, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.consequent, fn, matches);

                return status;
            case 'SelectStatement':
                return this.filterNestedNodes(node.cases, fn, matches);
            case 'SingleLineComment':
                break;
            case 'SwitchCase':
                status = this.filterNestedNodes(node.tests, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.consequent, fn, matches);

                return status;
            case 'SwitchCaseRange':
                status = this.filterNestedNode(node.from, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.to, fn, matches);

                return status;
            case 'SwitchStatement':
                status = this.filterNestedNode(node.discriminant, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.cases, fn, matches);

                return status;
            case 'UnaryExpression':
                return this.filterNestedNode(node.argument, fn, matches);
            case 'VariableDeclaration':
                return this.filterNestedNodes(node.declarations, fn, matches);
            case 'VariableDeclarator':
                status = this.filterNestedNode(node.id, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNode(node.init, fn, matches);

                return status;
            case 'VariableIdentifier':
                break;
            case 'WhileStatement':
                status = this.filterNestedNode(node.test, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.body, fn, matches);

                return status;
            case 'WithStatement':
                status = this.filterNestedNode(node.object, fn, matches);

                if (
                    status === NodeFilterAction.Stop ||
                    status === NodeFilterAction.StopAndSkip
                ) {
                    return status;
                }

                status = this.filterNestedNodes(node.body, fn, matches);

                return status;
            default:
                // @ts-expect-error exhaustive check, this should never happen
                throw new Error('Unsupported type: ' + node.type);
        }

        return NodeFilterAction.Continue;
    }

    filterNestedNodes(
        nodeList: NodeList | null,
        fn: (node: Node) => NodeFilterAction | never,
        matches: Node[],
    ): NodeFilterAction {
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

    public getIncludes(): readonly Include[] {
        return this.includes;
    }

    public getText(location?: LocationRange): string {
        if (location === undefined) {
            return this.text;
        }

        return this.text.slice(location.start.offset, location.end.offset);
    }

    public getScope(): Scope {
        return this.scope;
    }
}
