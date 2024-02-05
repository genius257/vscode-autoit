import TypeNode from "../Ast/Type/TypeNode";
import TokenIterator from "./TokenIterator";

// https://github.com/phpstan/phpdoc-parser/blob/bd84b629c8de41aa2ae82c067c955e06f1b00240/src/Parser/TypeParser.php
export default class TypeParser {
    public constructor(constExprParser: unknown, quoteAwareConstExprString: boolean = false, usedAttributes: {lines?: boolean, indexes?: boolean} = {}) {
        //FIXME
    }

    public parse(tokens: TokenIterator): TypeNode {
        return new TypeNode();
    }
}