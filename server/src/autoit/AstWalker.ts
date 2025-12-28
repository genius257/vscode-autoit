import { AutoIt3 } from 'autoit3-pegjs';
import { Node, NodeFilterAction, NodeList } from './Script';

export default class AstWalker {
    protected rootElement: Node | AutoIt3.Program;

    public constructor(rootElement: Node | AutoIt3.Program) {
        this.rootElement = rootElement;
    }

    public static filterNestedNode(
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
            case 'NotExpression':
                return this.filterNestedNode(node.value, fn, matches);
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

    public static filterNestedNodes(
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
}
