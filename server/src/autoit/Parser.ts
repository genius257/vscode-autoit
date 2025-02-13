import parser, { type AutoIt3, type LocationRange, type SyntaxError } from "autoit3-pegjs";

export default class Parser {
    public static parse(input: string, grammarSource: string|undefined): AutoIt3.Program {
        return parser.parse(input, {grammarSource: grammarSource});
    }

    public static isSyntaxError(e: any): e is SyntaxError {
        return e instanceof Error && 'location' in e && 'expected' in e && 'found' in e && 'format' in e;
    }

    public static isPositionWithinLocation(line: number, column: number, location: LocationRange): boolean {
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

    public static AstToString(ast:null|AutoIt3.Program|AutoIt3.SourceElement|AutoIt3.AssignmentExpression|AutoIt3.FormalParameter|AutoIt3.Statement|AutoIt3.RedimIdentifierExpression|AutoIt3.DefaultClause|AutoIt3.SelectCaseClause|AutoIt3.CaseClause|AutoIt3.VariableDeclaration|AutoIt3.EnumDeclaration|AutoIt3.Initialiser|AutoIt3.SwitchCaseValue|AutoIt3.Macro): string {
        if (ast === null) {
            return "";
        }
        const type = ast.type;
        switch (type) {
            case "Program":
                return ast.body.map(sourceElement => this.AstToString(sourceElement)).join("\n");
            case "ArrayDeclaration":
                return "["+this.AstArrayToStringArray(ast.elements).join(", ")+"]";
            case "AssignmentExpression":
                return this.AstToString(ast.left)+ast.operator+this.AstToString(ast.right);
            case "BinaryExpression":
                return this.AstToString(ast.left) + ast.operator + this.AstToString(ast.right);
            case "CallExpression":
                return this.AstToString(ast.callee)+"("+this.AstArrayToStringArray(ast.arguments).join(", ")+")";
            case "ConditionalExpression":
                return this.AstToString(ast.test) + " ? " + this.AstToString(ast.consequent) + " : " + this.AstToString(ast.alternate);
            case "ContinueCaseStatement":
                return "ContinueCase";
            case "ContinueLoopStatement":
                return "ContinueLoop";
            case "DoWhileStatement":
                return "Do\n"+this.AstArrayToStringArray(ast.body).join("\n")+"\nWhile "+this.AstToString(ast.test);
            case "EmptyStatement":
                return "";
            case "EnumDeclaration":
                return (ast.scope === null ? "" : ast.scope+" " ) + (ast.constant?"Const ":"") + "Enum Step " + ast.stepoperator + ast.stepval + this.AstArrayToStringArray(ast.declarations);
            case "ExitLoopStatement":
                return "ExitLoop "+this.AstToString(ast.level);
            case "ExitStatement":
                return "Exit "+this.AstToString(ast.argument);
            case "ExpressionStatement":
                return this.AstToString(ast.expression);
            case "ForInStatement":
                return "For "+this.AstToString(ast.left)+" In "+this.AstToString(ast.right)+"\n"+this.AstArrayToStringArray(ast.body).join("\n")+"\nNext";
            case "ForStatement":
                return "For "+this.AstToString(ast.init)+" To "+this.AstToString(ast.test)+(ast.update === null ? "" : " Step "+this.AstToString(ast.update))+"\n"+this.AstArrayToStringArray(ast.body).join("\n")+"\nNext";
            case "FunctionDeclaration":
                return "Func "+ast.id.name+"("+this.AstArrayToStringArray(ast.params).join(", ")+")\n"+this.AstArrayToStringArray(ast.body).join("\n")+"\nEndFunc";
            case "Identifier":
                return ast.name;
            case "IfStatement":
                return "If "+this.AstToString(ast.test)+" Then\n"+(Array.isArray(ast.consequent) ? this.AstArrayToStringArray(ast.consequent).join("\n") : this.AstToString(ast.consequent))+"\nEndIf";
            case "IncludeOnceStatement":
                return "#include-once";
            case "IncludeStatement":
                return "#include \""+ast.file+"\"";
            case "Keyword":
                return ast.value;
            case "Literal":
                return JSON.stringify(ast.value);
            case "LogicalExpression":
                return ast.left + " " + ast.operator + " " + ast.right;
            case "Macro":
                return ast.value;
            case "MemberExpression":
                if (ast.computed) { // array index accessor
                    return this.AstToString(ast.object)+"["+this.AstToString(ast.property)+"]";
                } else { // object property accessor
                    return this.AstToString(ast.object)+"."+this.AstToString(ast.property);
                }
            case "MultiLineComment":
                return "#cs" + ast.body + "\n#ce";
            case "NotExpression":
                return "Not " + this.AstToString(ast.value);
            case "Parameter":
                return (ast.const ? "Const " : "" ) + (ast.byref ? "ByRef " : "") + this.AstToString(ast.id) + (ast.init === null ? "" : " = " + this.AstToString(ast.init));
            case "ParenthesizedExpression":
                return this.AstToString(ast.expression);
            case "PreProcStatement":
                return "#"+ast.body;
            case "RedimExpression":
                return "ReDim "+this.AstArrayToStringArray(ast.declarations).join(",");
            case "RedimIdentifierExpression":
                throw new Error("Parser node not implemented correct, yet.");//FIXME
            case "ReturnStatement":
                return "Return "+this.AstToString(ast.value);
            case "SelectCase":
                return "Case " + this.AstToString(ast.tests)+"\n"+this.AstArrayToStringArray(ast.consequent).join("\n");
            case "SelectStatement":
                return "Select\n"+this.AstArrayToStringArray(ast.cases).join("\n")+"\nEndSelect";
            case "SingleLineComment":
                return ";"+ast.body;
            case "SwitchCase":
                return "Case " + this.AstArrayToStringArray(ast.tests).join(", ")+"\n"+this.AstArrayToStringArray(ast.consequent).join("\n");
            case "SwitchCaseRange":
                return this.AstToString(ast.from)+" To "+this.AstToString(ast.to);
            case "SwitchStatement":
                return "Switch " + this.AstToString(ast.discriminant) + "\n" + this.AstArrayToStringArray(ast.cases).join("\n") + "\nEndSwitch";
            case "UnaryExpression":
                return ast.operator + this.AstToString(ast.argument);
            case "VariableDeclaration":
                return (ast.scope === null ? "" : ast.scope+" " )+(ast.constant ? "Const " : "")+this.AstArrayToStringArray(ast.declarations);
            case "VariableDeclarator":
                return this.AstToString(ast.id)+" = "+this.AstToString(ast.init);
            case "VariableIdentifier":
                return "$"+ast.name;
            case "WhileStatement":
                return "While "+ast.test+"\n"+this.AstArrayToStringArray(ast.body).join("\n")+"\nWEnd";
            case "WithStatement":
                return "With "+this.AstToString(ast.object)+"\n"+this.AstArrayToStringArray(ast.body).join("\n")+"\nEndWith";
            default:
                (function(type: never): never {
                    throw new Error(`AST type not supported: "${type}"`);
                })(type);
        }
    }

    public static AstArrayToStringArray(astArray: AutoIt3.StatementList|AutoIt3.FormalParameterList|AutoIt3.RedimIdentifierExpression[]|(AutoIt3.DefaultClause | AutoIt3.SelectCaseClause)[]|(AutoIt3.DefaultClause | AutoIt3.CaseClause)[]|AutoIt3.VariableDeclarationList|AutoIt3.EnumDeclarationList|AutoIt3.ArgumentList|AutoIt3.CaseValueList|AutoIt3.ArrayDeclarationElementList|null): string[] {
        const result: string[] = [];
        if (astArray === null) {
            return [];
        }
        for (const ast of astArray) {
            result.push(this.AstToString(ast));
        }
        return result;
    }
}
