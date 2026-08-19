import { TokenType } from '../Lexer/Lexer';
import TokenIterator, { ParserException } from './TokenIterator';
import StringUnescaper from './StringUnescaper';
import Attribute from '../Ast/Attribute';
import { Constructor } from '@utils/trait';
import QuoteAwareConstExprStringNode, { QuoteAwareConstExprStringNodeQuoted } from '../Ast/ConstExpr/QuoteAwareConstExprStringNode';
import { str_replace, strtolower, substr } from 'locutus/php/strings';
import ConstExprNode from '../Ast/ConstExpr/ConstExprNode';
import ConstExprArrayItemNode from '../Ast/ConstExpr/ConstExprArrayItemNode';
import ConstExprArrayNode from '../Ast/ConstExpr/ConstExprArrayNode';
import ConstExprIntegerNode from '../Ast/ConstExpr/ConstExprIntegerNode';
import ConstExprStringNode from '../Ast/ConstExpr/ConstExprStringNode';
import ConstExprFloatNode from '../Ast/ConstExpr/ConstExprFloatNode';
import DoctrineConstExprStringNode from '../Ast/ConstExpr/DoctrineConstExprStringNode';
import ConstExprTrueNode from '../Ast/ConstExpr/ConstExprTrueNode';
import ConstExprFalseNode from '../Ast/ConstExpr/ConstExprFalseNode';
import ConstExprNullNode from '../Ast/ConstExpr/ConstExprNullNode';
import ConstFetchNode from '../Ast/ConstExpr/ConstFetchNode';

export default class ConstExprParser {
    private unescapeStrings: boolean;
    private quoteAwareConstExprString: boolean;
    private useLinesAttributes: boolean;
    private useIndexAttributes: boolean;
    private parseDoctrineStrings: boolean;

    public constructor(unescapeStrings: boolean = false, quoteAwareConstExprString: boolean = false, usedAttributes: { lines?: boolean, indexes?: boolean } = {}) {
        this.unescapeStrings = unescapeStrings;
        this.quoteAwareConstExprString = quoteAwareConstExprString;
        this.useLinesAttributes = usedAttributes.lines ?? false;
        this.useIndexAttributes = usedAttributes.indexes ?? false;
        this.parseDoctrineStrings = false;
    }

    public toDoctrine(): this {
        const self = new (this.constructor as Constructor<ConstExprParser>)(
            this.unescapeStrings,
            this.quoteAwareConstExprString,
            {
                lines: this.useLinesAttributes,
                indexes: this.useIndexAttributes,
            },
        );

        self.parseDoctrineStrings = true;

        return self as this;
    }

    public parse(tokens: TokenIterator, trimStrings: boolean = false): ConstExprNode {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();

        let value: string;

        if (tokens.isCurrentTokenType(TokenType.TOKEN_FLOAT)) {
            value = tokens.currentTokenValue();
            tokens.next();

            return this.enrichWithAttributes(
                tokens,
                new ConstExprFloatNode(str_replace('_', '', value).toString()),
                startLine,
                startIndex,
            );
        }

        if (tokens.isCurrentTokenType(TokenType.TOKEN_INTEGER)) {
            value = tokens.currentTokenValue();
            tokens.next();

            return this.enrichWithAttributes(
                tokens,
                new ConstExprIntegerNode(str_replace('_', '', value).toString()),
                startLine,
                startIndex,
            );
        }

        if (this.parseDoctrineStrings && tokens.isCurrentTokenType(TokenType.TOKEN_DOCTRINE_ANNOTATION_STRING)) {
            value = tokens.currentTokenValue();
            tokens.next();

            return this.enrichWithAttributes(
                tokens,
                new DoctrineConstExprStringNode(DoctrineConstExprStringNode.unescape(value)),
                startLine,
                startIndex,
            );
        }

        if (tokens.isCurrentTokenType(TokenType.TOKEN_SINGLE_QUOTED_STRING, TokenType.TOKEN_DOUBLE_QUOTED_STRING)) {
            if (this.parseDoctrineStrings) {
                if (tokens.isCurrentTokenType(TokenType.TOKEN_SINGLE_QUOTED_STRING)) {
                    throw new ParserException(
                        tokens.currentTokenValue(),
                        tokens.currentTokenType(),
                        tokens.currentTokenOffset(),
                        TokenType.TOKEN_DOUBLE_QUOTED_STRING,
                        null,
                        tokens.currentTokenLine(),
                    );
                }

                value = tokens.currentTokenValue();
                tokens.next();

                return this.enrichWithAttributes(
                    tokens,
                    this.parseDoctrineString(value, tokens),
                    startLine,
                    startIndex,
                );
            }

            value = tokens.currentTokenValue();

            const type = tokens.currentTokenType();

            if (trimStrings) {
                if (this.unescapeStrings) {
                    value = StringUnescaper.unescapeString(value);
                } else {
                    value = substr(value, 1, -1).toString();
                }
            }

            tokens.next();

            if (this.quoteAwareConstExprString) {
                return this.enrichWithAttributes(
                    tokens,
                    new QuoteAwareConstExprStringNode(
                        value,
                        type === TokenType.TOKEN_SINGLE_QUOTED_STRING
                            ? QuoteAwareConstExprStringNodeQuoted.SINGLE_QUOTED
                            : QuoteAwareConstExprStringNodeQuoted.DOUBLE_QUOTED,
                    ),
                    startLine,
                    startIndex,
                );
            }

            return this.enrichWithAttributes(
                tokens,
                new ConstExprStringNode(value),
                startLine,
                startIndex,
            );
        } else if (tokens.isCurrentTokenType(TokenType.TOKEN_IDENTIFIER)) {
            const identifier = tokens.currentTokenValue();
            tokens.next();

            switch (strtolower(identifier)) {
                case 'true':
                    return this.enrichWithAttributes(
                        tokens,
                        new ConstExprTrueNode(),
                        startLine,
                        startIndex,
                    );
                case 'false':
                    return this.enrichWithAttributes(
                        tokens,
                        new ConstExprFalseNode(),
                        startLine,
                        startIndex,
                    );
                case 'null':
                    return this.enrichWithAttributes(
                        tokens,
                        new ConstExprNullNode(),
                        startLine,
                        startIndex,
                    );
                case 'array':
                    tokens.consumeTokenType(TokenType.TOKEN_OPEN_PARENTHESES);

                    return this.parseArray(tokens, TokenType.TOKEN_CLOSE_PARENTHESES, startIndex);
            }

            if (tokens.tryConsumeTokenType(TokenType.TOKEN_DOUBLE_COLON)) {
                let classConstantName = '';
                let lastType: TokenType | null = null;

                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                while (true) {
                    if (lastType !== TokenType.TOKEN_IDENTIFIER && tokens.currentTokenType() === TokenType.TOKEN_IDENTIFIER) {
                        classConstantName += tokens.currentTokenValue();
                        tokens.consumeTokenType(TokenType.TOKEN_IDENTIFIER);
                        lastType = TokenType.TOKEN_IDENTIFIER;

                        continue;
                    }

                    if (lastType !== TokenType.TOKEN_WILDCARD && tokens.tryConsumeTokenType(TokenType.TOKEN_WILDCARD)) {
                        classConstantName += '*';
                        lastType = TokenType.TOKEN_WILDCARD;

                        if (tokens.getSkippedHorizontalWhiteSpaceIfAny() !== '') {
                            break;
                        }

                        continue;
                    }

                    if (lastType === null) {
                        // trigger parse error if nothing valid was consumed
                        tokens.consumeTokenType(TokenType.TOKEN_WILDCARD);
                    }

                    break;
                }

                return this.enrichWithAttributes(
                    tokens,
                    new ConstFetchNode(identifier, classConstantName),
                    startLine,
                    startIndex,
                );
            }

            return this.enrichWithAttributes(
                tokens,
                new ConstFetchNode('', identifier),
                startLine,
                startIndex,
            );
        } else if (tokens.tryConsumeTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
            return this.parseArray(tokens, TokenType.TOKEN_CLOSE_SQUARE_BRACKET, startIndex);
        }

        throw new ParserException(
            tokens.currentTokenValue(),
            tokens.currentTokenType(),
            tokens.currentTokenOffset(),
            TokenType.TOKEN_IDENTIFIER,
            null,
            tokens.currentTokenLine(),
        );
    }

    /**
     * This method is supposed to be called with TokenIterator after reading TOKEN_DOUBLE_QUOTED_STRING and shifting
     * to the next token.
     */
    public parseDoctrineString(text: string, tokens: TokenIterator): DoctrineConstExprStringNode {
        /*
         * Because of how Lexer works, a valid Doctrine string
         * can consist of a sequence of TOKEN_DOUBLE_QUOTED_STRING and TOKEN_DOCTRINE_ANNOTATION_STRING
         */
        while (tokens.isCurrentTokenType(TokenType.TOKEN_DOUBLE_QUOTED_STRING, TokenType.TOKEN_DOCTRINE_ANNOTATION_STRING)) {
            text += tokens.currentTokenValue();
            tokens.next();
        }

        return new DoctrineConstExprStringNode(DoctrineConstExprStringNode.unescape(text));
    }

    private parseArray(tokens: TokenIterator, endToken: TokenType, startIndex: number): ConstExprArrayNode {
        const items: ConstExprArrayItemNode[] = [];

        const startLine = tokens.currentTokenLine();

        if (!tokens.tryConsumeTokenType(endToken)) {
            do {
                items.push(this.parseArrayItem(tokens));
            } while (tokens.tryConsumeTokenType(TokenType.TOKEN_COMMA) && !tokens.isCurrentTokenType(endToken));
            tokens.consumeTokenType(endToken);
        }

        return this.enrichWithAttributes(
            tokens,
            new ConstExprArrayNode(items),
            startLine,
            startIndex,
        );
    }

    private parseArrayItem(tokens: TokenIterator): ConstExprArrayItemNode {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();

        const expr = this.parse(tokens);
        let key: ConstExprNode | null;
        let value: ConstExprNode;

        if (tokens.tryConsumeTokenType(TokenType.TOKEN_DOUBLE_ARROW)) {
            key = expr;
            value = this.parse(tokens);
        } else {
            key = null;
            value = expr;
        }

        return this.enrichWithAttributes(
            tokens,
            new ConstExprArrayItemNode(key, value),
            startLine,
            startIndex,
        );
    }

    private enrichWithAttributes<T extends ConstExprNode>(tokens: TokenIterator, node: T, startLine: number, startIndex: number): T {
        if (this.useLinesAttributes) {
            node.setAttribute(Attribute.START_LINE, startLine);
            node.setAttribute(Attribute.END_LINE, tokens.currentTokenLine());
        }

        if (this.useIndexAttributes) {
            node.setAttribute(Attribute.START_INDEX, startIndex);
            node.setAttribute(Attribute.END_INDEX, tokens.endIndexOfLastRelevantToken());
        }

        return node;
    }
}
