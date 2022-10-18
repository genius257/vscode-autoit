import { AssignmentExpression, FormalParameter, FormalParameterList, LocationRange, Program, SourceElement, Statement, StatementList } from "autoit3-pegjs";
import { Range } from "vscode-languageserver";

export default class Parser {
    /** Converts a autoit3-pegjs Location to a vscode Range */
    public static locationToRange(location: LocationRange): Range {
        return {
            start: {
                character: location.start.column - 1,
                line: location.start.line - 1,
            },
            end: {
                character: location.end.column - 1,
                line: location.end.line - 1,
            }
        }
    }

    public static AstToString(ast:null|Program|SourceElement|AssignmentExpression|FormalParameter|Statement): string {
        if (ast === null) {
            return "";
        }
        switch (ast.type) {
            case "Program":
                return ast.body.map(sourceElement => this.AstToString(sourceElement)).join("\n");
            case "ContinueCaseStatement":
                return "ContinueCase";
            case "ContinueLoopStatement":
                return "ContinueLoop";
            case "DoWhileStatement":
                return "Do\n"+this.AstArrayToStringArray(ast.body).join("\n")+"\nWhile "+this.AstToString(ast.test);
            case "EmptyStatement":
                return "";
            case "ExitLoopStatement":
                return "ExitLoop "+this.AstToString(ast.level);
            case "ExitStatement":
                return "Exit "+this.AstToString(ast.argument);
            case "ExpressionStatement":
                return this.AstToString(ast.expression);
            case "FunctionDeclaration":
                return "Func "+ast.id.name+"("+this.AstArrayToStringArray(ast.params).join(",")+")\n"+this.AstArrayToStringArray(ast.body).join("\n")+"\nEndFunc";
            case "Identifier":
                return ast.name;
            case "IfStatement":
                return "If "+this.AstToString(ast.test)+" Then\n"+(Array.isArray(ast.consequent) ? this.AstArrayToStringArray(ast.consequent).join("\n") : this.AstToString(ast.consequent))+"\nEndIf";
            case "IncludeOnceStatement":
                return "#include-once";
            default:
                throw new Error("AST type not supported: "+ast.type);
        }
    }

    public static AstArrayToStringArray(astArray: StatementList|FormalParameterList): string[] {
        const result: string[] = [];
        for (const ast of astArray) {
            result.push(this.AstToString(ast));
        }
        return result;
    }
}
