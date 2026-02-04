import parser, { type AutoIt3, type LocationRange, type SyntaxError } from 'autoit3-pegjs';

export function parse(
    input: string,
    grammarSource: string | undefined,
): AutoIt3.Program {
    return parser.parse(input, { grammarSource: grammarSource });
}

export function isSyntaxError(e: unknown): e is SyntaxError {
    return e instanceof Error && 'location' in e && 'expected' in e && 'found' in e && 'format' in e;
}

export function isPositionWithinLocation(
    line: number,
    column: number,
    location: LocationRange,
): boolean {
    // Check if position line is above the start line or below the end line
    if (line < location.start.line || line > location.end.line) {
        return false;
    }

    // Check if position is on the start line but before the start column
    if (line === location.start.line && column < location.start.column) {
        return false;
    }

    // Check if position is on the end line but after the end column
    if (line === location.end.line && column > location.end.column) {
        return false;
    }

    // If none of the above conditions are met, the position is within the range
    return true;
}

export function AstToString(
    ast:
        | null
        | AutoIt3.Program
        | AutoIt3.SourceElement
        | AutoIt3.AssignmentExpression
        | AutoIt3.AssignmentExpressionInWith
        | AutoIt3.FormalParameter
        | AutoIt3.Statement
        | AutoIt3.StatementInWith
        | AutoIt3.RedimIdentifierExpression
        | AutoIt3.DefaultClause
        | AutoIt3.DefaultClauseInWith
        | AutoIt3.SelectCaseClause
        | AutoIt3.SelectCaseClauseInWith
        | AutoIt3.CaseClause
        | AutoIt3.CaseClauseInWith
        | AutoIt3.VariableDeclaration
        | AutoIt3.VariableDeclarationInWith
        | AutoIt3.EnumDeclaration
        | AutoIt3.EnumDeclarationInWith
        | AutoIt3.Initialiser
        | AutoIt3.InitialiserInWith
        | AutoIt3.SwitchCaseValue
        | AutoIt3.SwitchCaseValueInWith
        | AutoIt3.Macro,
): string {
    if (ast === null) {
        return '';
    }

    const type = ast.type;

    switch (type) {
        case 'Program':
            return ast.body.map((sourceElement) => AstToString(sourceElement)).join('\n');
        case 'ArrayDeclaration':
            return '[' + AstArrayToStringArray(ast.elements).join(', ') + ']';
        case 'AssignmentExpression':
            return AstToString(ast.left) +
                ' ' +
                ast.operator +
                ' ' +
                AstToString(ast.right);
        case 'BinaryExpression':
            return AstToString(ast.left) +
                ast.operator +
                AstToString(ast.right);
        case 'CallExpression':
            return AstToString(ast.callee) + '(' + AstArrayToStringArray(ast.arguments).join(', ') + ')';
        case 'ConditionalExpression':
            return AstToString(ast.test) + ' ? ' + AstToString(ast.consequent) + ' : ' + AstToString(ast.alternate);
        case 'ContinueCaseStatement':
            return 'ContinueCase';
        case 'ContinueLoopStatement':
            return 'ContinueLoop';
        case 'DoWhileStatement':
            return 'Do\n' + AstArrayToStringArray(ast.body).join('\n') + '\nWhile ' + AstToString(ast.test);
        case 'EmptyStatement':
            return '';
        case 'EnumDeclaration':
            return (ast.scope === null ? '' : ast.scope + ' ') + (ast.constant ? 'Const ' : '') + 'Enum Step ' + ast.stepoperator + ast.stepval + AstArrayToStringArray(ast.declarations);
        case 'ExitLoopStatement':
            return 'ExitLoop ' + AstToString(ast.level);
        case 'ExitStatement':
            return 'Exit ' + AstToString(ast.argument);
        case 'ExpressionStatement':
            return AstToString(ast.expression);
        case 'ForInStatement':
            return 'For ' + AstToString(ast.left) + ' In ' + AstToString(ast.right) + '\n' + AstArrayToStringArray(ast.body).join('\n') + '\nNext';
        case 'ForStatement':
            return 'For ' + AstToString(ast.init) + ' To ' + AstToString(ast.test) + (ast.update === null ? '' : ' Step ' + AstToString(ast.update)) + '\n' + AstArrayToStringArray(ast.body).join('\n') + '\nNext';
        case 'FunctionDeclaration':
            return 'Func ' + ast.id.name + '(' + AstArrayToStringArray(ast.params).join(', ') + ')\n' + AstArrayToStringArray(ast.body).join('\n') + '\nEndFunc';
        case 'Identifier':
            return ast.name;
        case 'IfStatement':
            return 'If ' + AstToString(ast.test) + ' Then\n' + (Array.isArray(ast.consequent) ? AstArrayToStringArray(ast.consequent).join('\n') : AstToString(ast.consequent)) + '\nEndIf';
        case 'IncludeOnceStatement':
            return '#include-once';
        case 'IncludeStatement':
            return '#include "' + ast.file + '"';
        case 'Keyword':
            return ast.value;
        case 'Literal':
            if (typeof ast.value === 'string') {
                return '"' + ast.value + '"';
            }

            return JSON.stringify(ast.value);
        case 'LogicalExpression':
            return ast.left + ' ' + ast.operator + ' ' + ast.right;
        case 'Macro':
            return ast.value;
        case 'MemberExpression':
            if (ast.computed) { // array index accessor
                return AstToString(ast.object) + '[' + AstToString(ast.property) + ']';
            } else { // object property accessor
                return AstToString(ast.object) + '.' + AstToString(ast.property);
            }
        case 'MultiLineComment':
            return '#cs' + ast.body + '\n#ce';
        case 'Parameter':
            return (ast.const ? 'Const ' : '') + (ast.byref ? 'ByRef ' : '') + AstToString(ast.id) + (ast.init === null ? '' : ' = ' + AstToString(ast.init));
        case 'ParenthesizedExpression':
            return AstToString(ast.expression);
        case 'PreProcStatement':
            return '#' + ast.body;
        case 'RedimExpression':
            return 'ReDim ' + AstArrayToStringArray(ast.declarations).join(',');
        case 'RedimIdentifierExpression':
            throw new Error('Parser node not implemented correct, yet.');// FIXME
        case 'ReturnStatement':
            return 'Return ' + AstToString(ast.value);
        case 'SelectCase':
            return 'Case ' + AstToString(ast.tests) + '\n' + AstArrayToStringArray(ast.consequent).join('\n');
        case 'SelectStatement':
            return 'Select\n' + AstArrayToStringArray(ast.cases).join('\n') + '\nEndSelect';
        case 'SingleLineComment':
            return ';' + ast.body;
        case 'SwitchCase':
            return 'Case ' + AstArrayToStringArray(ast.tests).join(', ') + '\n' + AstArrayToStringArray(ast.consequent).join('\n');
        case 'SwitchCaseRange':
            return AstToString(ast.from) + ' To ' + AstToString(ast.to);
        case 'SwitchStatement':
            return 'Switch ' + AstToString(ast.discriminant) + '\n' + AstArrayToStringArray(ast.cases).join('\n') + '\nEndSwitch';
        case 'UnaryExpression':
            return ast.operator + AstToString(ast.argument);
        case 'VariableDeclaration':
            return (ast.scope === null ? '' : ast.scope + ' ') + (ast.constant ? 'Const ' : '') + AstArrayToStringArray(ast.declarations);
        case 'VariableDeclarator':
            return AstToString(ast.id) + ' = ' + AstToString(ast.init);
        case 'VariableIdentifier':
            return '$' + ast.name;
        case 'WhileStatement':
            return 'While ' + ast.test + '\n' + AstArrayToStringArray(ast.body).join('\n') + '\nWEnd';
        case 'WithStatement':
            return 'With ' + AstToString(ast.object) + '\n' + AstArrayToStringArray(ast.body).join('\n') + '\nEndWith';
        default:
            (function (type: never): never {
                throw new Error(`AST type not supported: "${type}"`);
            })(type);
    }
}

export function AstArrayToStringArray(
    astArray:
        | AutoIt3.StatementList
        | AutoIt3.StatementListInWith
        | AutoIt3.FormalParameterList
        | AutoIt3.RedimIdentifierExpression[]
        | (AutoIt3.DefaultClause | AutoIt3.SelectCaseClause)[]
        | (AutoIt3.DefaultClauseInWith | AutoIt3.SelectCaseClauseInWith)[]
        | (AutoIt3.DefaultClause | AutoIt3.CaseClause)[]
        | (AutoIt3.DefaultClauseInWith | AutoIt3.CaseClauseInWith)[]
        | AutoIt3.VariableDeclarationList
        | AutoIt3.VariableDeclarationListInWith
        | AutoIt3.EnumDeclarationList
        | AutoIt3.EnumDeclarationListInWith
        | AutoIt3.ArgumentList
        | AutoIt3.ArgumentListInWith
        | AutoIt3.CaseValueList
        | AutoIt3.CaseValueListInWith
        | AutoIt3.ArrayDeclarationElementList
        | AutoIt3.ArrayDeclarationElementListInWith
        | AutoIt3.AssignmentExpression[]
        | AutoIt3.AssignmentExpressionInWith[]
        | null,
): string[] {
    const result: string[] = [];

    if (astArray === null) {
        return [];
    }

    for (const ast of astArray) {
        result.push(AstToString(ast));
    }

    return result;
}
