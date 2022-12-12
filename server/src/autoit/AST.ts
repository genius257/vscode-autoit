import { ArgumentList, ArrayDeclaration, ArrayDeclarationElementList, AssignmentExpression, CaseClause, CaseValueList, DefaultClause, FormalParameter, FormalParameterList, IncludeStatement, Macro, SelectCaseClause, SourceElement, SourceElements, SwitchCaseValue, VariableDeclaration, VariableDeclarationList } from "autoit3-pegjs";

namespace AST {
    export type Node = SourceElement|AssignmentExpression|FormalParameter|VariableDeclaration|ArrayDeclaration|DefaultClause|CaseClause|SelectCaseClause|SwitchCaseValue|Macro|IncludeStatement;
    export type NodeList = SourceElements|ArgumentList|VariableDeclarationList|FormalParameterList|(DefaultClause | CaseClause | SelectCaseClause)[]|ArrayDeclarationElementList|CaseValueList;
}

export default AST;
