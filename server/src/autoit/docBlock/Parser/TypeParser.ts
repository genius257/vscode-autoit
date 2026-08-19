import { str_replace, substr_compare, trim } from 'locutus/php/strings';
import Attribute from '../Ast/Attribute';
import Node from '../Ast/Node';
import TypeNode from '../Ast/Type/TypeNode';
import { TokenType } from '../Lexer/Lexer';
import TokenIterator, { LogicException, ParserException } from './TokenIterator';
import StringUnescaper from './StringUnescaper';
import ConstExprParser from './ConstExprParser';
import ThisTypeNode from '../Ast/Type/ThisTypeNode';
import IdentifierTypeNode from '../Ast/Type/IdentifierTypeNode';
import ConstExprArrayNode from '../Ast/ConstExpr/ConstExprArrayNode';
import ConstTypeNode from '../Ast/Type/ConstTypeNode';
import UnionTypeNode from '../Ast/Type/UnionTypeNode';
import IntersectionTypeNode from '../Ast/Type/IntersectionTypeNode';
import ConditionalTypeNode from '../Ast/Type/ConditionalTypeNode';
import ConditionalTypeForParameterNode from '../Ast/Type/ConditionalTypeForParameterNode';
import NullableTypeNode from '../Ast/Type/NullableTypeNode';
import GenericTypeNode, { GenericTypeNodeVariance } from '../Ast/Type/GenericTypeNode';
import CallableTypeParameterNode from '../Ast/Type/CallableTypeParameterNode';
import CallableTypeNode from '../Ast/Type/CallableTypeNode';
import ArrayTypeNode from '../Ast/Type/ArrayTypeNode';
import OffsetAccessTypeNode from '../Ast/Type/OffsetAccessTypeNode';
import ArrayShapeNode, { ArrayShapeNodeKind } from '../Ast/Type/ArrayShapeNode';
import ArrayShapeItemNode from '../Ast/Type/ArrayShapeItemNode';
import ConstExprIntegerNode from '../Ast/ConstExpr/ConstExprIntegerNode';
import ConstExprStringNode from '../Ast/ConstExpr/ConstExprStringNode';
import QuoteAwareConstExprStringNode, { QuoteAwareConstExprStringNodeQuoted } from '../Ast/ConstExpr/QuoteAwareConstExprStringNode';
import ObjectShapeNode from '../Ast/Type/ObjectShapeNode';
import ObjectShapeItemNode from '../Ast/Type/ObjectShapeItemNode';

// https://github.com/phpstan/phpdoc-parser/blob/bd84b629c8de41aa2ae82c067c955e06f1b00240/src/Parser/TypeParser.php
export default class TypeParser {
    private constExprParser: ConstExprParser | null;
    private quoteAwareConstExprString: boolean;
    private useLinesAttributes: boolean;
    private useIndexAttributes: boolean;

    public constructor(
        constExprParser: ConstExprParser | null = null,
        quoteAwareConstExprString: boolean = false,
        usedAttributes: { lines?: boolean, indexes?: boolean } = {},
    ) {
        this.constExprParser = constExprParser;
        this.quoteAwareConstExprString = quoteAwareConstExprString;
        this.useLinesAttributes = usedAttributes.lines ?? false;
        this.useIndexAttributes = usedAttributes.indexes ?? false;
    }

    public parse(tokens: TokenIterator): TypeNode {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();
        let type: TypeNode;

        if (tokens.isCurrentTokenType(TokenType.TOKEN_NULLABLE)) {
            type = this.parseNullable(tokens);
        } else {
            type = this.parseAtomic(tokens);

            if (tokens.isCurrentTokenType(TokenType.TOKEN_UNION)) {
                type = this.parseUnion(tokens, type);
            } else if (tokens.isCurrentTokenType(TokenType.TOKEN_INTERSECTION)) {
                type = this.parseIntersection(tokens, type);
            }
        }

        return this.enrichWithAttributes(tokens, type, startLine, startIndex);
    }

    public enrichWithAttributes<T extends Node>(tokens: TokenIterator, type: T, startLine: number, startIndex: number): T {
        if (this.useLinesAttributes) {
            type.setAttribute(Attribute.START_LINE, startLine);
            type.setAttribute(Attribute.END_LINE, tokens.currentTokenLine());
        }

        if (this.useIndexAttributes) {
            type.setAttribute(Attribute.START_INDEX, startIndex);
            type.setAttribute(Attribute.END_INDEX, tokens.endIndexOfLastRelevantToken());
        }

        return type;
    }

    public isHtml(tokens: TokenIterator): boolean {
        tokens.consumeTokenType(TokenType.TOKEN_OPEN_ANGLE_BRACKET);

        if (!tokens.isCurrentTokenType(TokenType.TOKEN_IDENTIFIER)) {
            return false;
        }

        const htmlTagName = tokens.currentTokenValue();

        tokens.next();

        if (!tokens.tryConsumeTokenType(TokenType.TOKEN_CLOSE_ANGLE_BRACKET)) {
            return false;
        }

        const endTag = `</${htmlTagName}>`;
        const endTagSearchOffset = -endTag.length;

        while (!tokens.isCurrentTokenType(TokenType.TOKEN_END)) {
            if (
                // eslint-disable-next-line @stylistic/no-extra-parens
                (
                    tokens.tryConsumeTokenType(TokenType.TOKEN_OPEN_ANGLE_BRACKET) &&
                    tokens.currentTokenValue().includes(`/${htmlTagName}>`)
                ) ||
                substr_compare(tokens.currentTokenValue(), endTag, endTagSearchOffset, 0) === 0
            ) {
                return true;
            }

            tokens.next();
        }

        return false;
    }

    public parseGeneric(tokens: TokenIterator, baseType: IdentifierTypeNode): GenericTypeNode {
        tokens.consumeTokenType(TokenType.TOKEN_OPEN_ANGLE_BRACKET);

        const startLine = baseType.getAttribute(Attribute.START_LINE);
        const startIndex = baseType.getAttribute(Attribute.START_INDEX);
        const genericTypes: TypeNode[] = [];
        const variances: GenericTypeNodeVariance[] = [];

        let isFirst = true;

        while (isFirst || tokens.tryConsumeTokenType(TokenType.TOKEN_COMMA)) {
            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

            // trailing comma case
            if (!isFirst && tokens.isCurrentTokenType(TokenType.TOKEN_CLOSE_ANGLE_BRACKET)) {
                break;
            }

            isFirst = false;

            const [genericType, variance] = this.parseGenericTypeArgument(tokens);
            genericTypes.push(genericType);
            variances.push(variance);

            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        }

        let type: GenericTypeNode = new GenericTypeNode(baseType, genericTypes, variances);

        if (startLine !== null && startIndex !== null) {
            type = this.enrichWithAttributes(tokens, type, startLine, startIndex);
        }

        tokens.consumeTokenType(TokenType.TOKEN_CLOSE_ANGLE_BRACKET);

        return type;
    }

    public parseGenericTypeArgument(tokens: TokenIterator): [TypeNode, GenericTypeNodeVariance] {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();

        if (tokens.tryConsumeTokenType(TokenType.TOKEN_WILDCARD)) {
            return [
                this.enrichWithAttributes(tokens, new IdentifierTypeNode('mixed'), startLine, startIndex),
                GenericTypeNodeVariance.VARIANCE_BIVARIANT,
            ];
        }

        let variance: GenericTypeNodeVariance;

        if (tokens.tryConsumeTokenValue('contravariant')) {
            variance = GenericTypeNodeVariance.VARIANCE_CONTRAVARIANT;
        } else if (tokens.tryConsumeTokenValue('covariant')) {
            variance = GenericTypeNodeVariance.VARIANCE_COVARIANT;
        } else {
            variance = GenericTypeNodeVariance.VARIANCE_INVARIANT;
        }

        const type = this.parse(tokens);

        return [type, variance];
    }

    private subParse(tokens: TokenIterator): TypeNode {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();
        let type: TypeNode;

        if (tokens.isCurrentTokenType(TokenType.TOKEN_NULLABLE)) {
            type = this.parseNullable(tokens);
        } else if (tokens.isCurrentTokenType(TokenType.TOKEN_VARIABLE)) {
            type = this.parseConditionalForParameter(tokens, tokens.currentTokenValue());
        } else {
            type = this.parseAtomic(tokens);

            if (tokens.isCurrentTokenValue('is')) {
                type = this.parseConditional(tokens, type);
            } else {
                tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

                if (tokens.isCurrentTokenType(TokenType.TOKEN_UNION)) {
                    type = this.subParseUnion(tokens, type);
                } else if (tokens.isCurrentTokenType(TokenType.TOKEN_INTERSECTION)) {
                    type = this.subParseIntersection(tokens, type);
                }
            }
        }

        return this.enrichWithAttributes(tokens, type, startLine, startIndex);
    }

    private parseAtomic(tokens: TokenIterator): TypeNode {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();
        let type: TypeNode;

        if (tokens.tryConsumeTokenType(TokenType.TOKEN_OPEN_PARENTHESES)) {
            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
            type = this.subParse(tokens);
            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

            tokens.consumeTokenType(TokenType.TOKEN_CLOSE_PARENTHESES);

            if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                type = this.tryParseArrayOrOffsetAccess(tokens, type);
            }

            return this.enrichWithAttributes(tokens, type, startLine, startIndex);
        }

        if (tokens.tryConsumeTokenType(TokenType.TOKEN_THIS_VARIABLE)) {
            type = this.enrichWithAttributes(tokens, new ThisTypeNode(), startLine, startIndex);

            if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                type = this.tryParseArrayOrOffsetAccess(tokens, type);
            }

            return this.enrichWithAttributes(tokens, type, startLine, startIndex);
        }

        let currentTokenValue = tokens.currentTokenValue();
        tokens.pushSavePoint(); // because of ConstFetchNode

        if (tokens.tryConsumeTokenType(TokenType.TOKEN_IDENTIFIER)) {
            type = this.enrichWithAttributes(tokens, new IdentifierTypeNode(currentTokenValue), startLine, startIndex);

            if (!tokens.isCurrentTokenType(TokenType.TOKEN_DOUBLE_COLON)) {
                tokens.dropSavePoint(); // because of ConstFetchNode

                if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_ANGLE_BRACKET)) {
                    tokens.pushSavePoint();

                    const isHtml = this.isHtml(tokens);
                    tokens.rollback();

                    if (isHtml) {
                        return type;
                    }

                    type = this.parseGeneric(tokens, type as IdentifierTypeNode);

                    if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                        type = this.tryParseArrayOrOffsetAccess(tokens, type);
                    }
                } else if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_PARENTHESES)) {
                    type = this.tryParseCallable(tokens, type as IdentifierTypeNode);
                } else if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                    type = this.tryParseArrayOrOffsetAccess(tokens, type);
                } else if ([
                    'array',
                    'list',
                    'object',
                ].includes((type as IdentifierTypeNode).name) && tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_CURLY_BRACKET) && !tokens.isPrecededByHorizontalWhitespace()) {
                    if ((type as IdentifierTypeNode).name === 'object') {
                        type = this.parseObjectShape(tokens);
                    } else {
                        type = this.parseArrayShape(tokens, type, (type as IdentifierTypeNode).name as ArrayShapeNodeKind);
                    }

                    if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                        type = this.tryParseArrayOrOffsetAccess(tokens, this.enrichWithAttributes(tokens, type, startLine, startIndex));
                    }
                }

                return this.enrichWithAttributes(tokens, type, startLine, startIndex);
            } else {
                tokens.rollback(); // because of ConstFetchNode
            }
        } else {
            tokens.dropSavePoint(); // because of ConstFetchNode
        }

        currentTokenValue = tokens.currentTokenValue();

        const currentTokenType = tokens.currentTokenType();
        const currentTokenOffset = tokens.currentTokenOffset();
        const currentTokenLine = tokens.currentTokenLine();

        if (this.constExprParser === null) {
            throw new ParserException(
                currentTokenValue,
                currentTokenType,
                currentTokenOffset,
                TokenType.TOKEN_IDENTIFIER,
                null,
                currentTokenLine,
            );
        }

        try {
            const constExpr = this.constExprParser.parse(tokens, true);

            if (constExpr instanceof ConstExprArrayNode) {
                throw new ParserException(
                    currentTokenValue,
                    currentTokenType,
                    currentTokenOffset,
                    TokenType.TOKEN_IDENTIFIER,
                    null,
                    currentTokenLine,
                );
            }

            return this.enrichWithAttributes(tokens, new ConstTypeNode(constExpr), startLine, startIndex);
        } catch (e) {
            if (!(e instanceof LogicException)) {
                throw e;
            }

            throw new ParserException(
                currentTokenValue,
                currentTokenType,
                currentTokenOffset,
                TokenType.TOKEN_IDENTIFIER,
                null,
                currentTokenLine,
            );
        }
    }

    private parseUnion(tokens: TokenIterator, type: TypeNode): TypeNode {
        const types = [type];

        while (tokens.tryConsumeTokenType(TokenType.TOKEN_UNION)) {
            types.push(this.parseAtomic(tokens));
        }

        return new UnionTypeNode(types);
    }

    private subParseUnion(tokens: TokenIterator, type: TypeNode): TypeNode {
        const types = [type];

        while (tokens.tryConsumeTokenType(TokenType.TOKEN_UNION)) {
            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
            types.push(this.parseAtomic(tokens));
            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        }

        return new UnionTypeNode(types);
    }

    private parseIntersection(tokens: TokenIterator, type: TypeNode): TypeNode {
        const types = [type];

        while (tokens.tryConsumeTokenType(TokenType.TOKEN_INTERSECTION)) {
            types.push(this.parseAtomic(tokens));
        }

        return new IntersectionTypeNode(types);
    }

    private subParseIntersection(tokens: TokenIterator, type: TypeNode): TypeNode {
        const types = [type];

        while (tokens.tryConsumeTokenType(TokenType.TOKEN_INTERSECTION)) {
            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
            types.push(this.parseAtomic(tokens));
            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        }

        return new IntersectionTypeNode(types);
    }

    private parseConditional(tokens: TokenIterator, subjectType: TypeNode): TypeNode {
        tokens.consumeTokenType(TokenType.TOKEN_IDENTIFIER);

        let negated = false;

        if (tokens.isCurrentTokenValue('not')) {
            negated = true;
            tokens.consumeTokenType(TokenType.TOKEN_IDENTIFIER);
        }

        const targetType = this.parse(tokens);

        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        tokens.consumeTokenType(TokenType.TOKEN_NULLABLE);
        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

        const ifType = this.parse(tokens);

        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        tokens.consumeTokenType(TokenType.TOKEN_COLON);
        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

        const elseType = this.subParse(tokens);

        return new ConditionalTypeNode(subjectType, targetType, ifType, elseType, negated);
    }

    private parseConditionalForParameter(tokens: TokenIterator, parameterName: string): TypeNode {
        tokens.consumeTokenType(TokenType.TOKEN_VARIABLE);
        tokens.consumeTokenValue(TokenType.TOKEN_IDENTIFIER, 'is');

        let negated = false;

        if (tokens.isCurrentTokenValue('not')) {
            negated = true;
            tokens.consumeTokenType(TokenType.TOKEN_IDENTIFIER);
        }

        const targetType = this.parse(tokens);

        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        tokens.consumeTokenType(TokenType.TOKEN_NULLABLE);
        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

        const ifType = this.parse(tokens);

        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        tokens.consumeTokenType(TokenType.TOKEN_COLON);
        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

        const elseType = this.subParse(tokens);

        return new ConditionalTypeForParameterNode(parameterName, targetType, ifType, elseType, negated);
    }

    private parseNullable(tokens: TokenIterator): TypeNode {
        tokens.consumeTokenType(TokenType.TOKEN_NULLABLE);

        const type = this.parseAtomic(tokens);

        return new NullableTypeNode(type);
    }

    private parseCallable(tokens: TokenIterator, identifier: IdentifierTypeNode): TypeNode {
        tokens.consumeTokenType(TokenType.TOKEN_OPEN_PARENTHESES);
        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

        const parameters: CallableTypeParameterNode[] = [];

        if (!tokens.isCurrentTokenType(TokenType.TOKEN_CLOSE_PARENTHESES)) {
            parameters.push(this.parseCallableParameter(tokens));
            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

            while (tokens.tryConsumeTokenType(TokenType.TOKEN_COMMA)) {
                tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

                if (tokens.isCurrentTokenType(TokenType.TOKEN_CLOSE_PARENTHESES)) {
                    break;
                }

                parameters.push(this.parseCallableParameter(tokens));
                tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
            }
        }

        tokens.consumeTokenType(TokenType.TOKEN_CLOSE_PARENTHESES);
        tokens.consumeTokenType(TokenType.TOKEN_COLON);

        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();
        const returnType = this.enrichWithAttributes(tokens, this.parseCallableReturnType(tokens), startLine, startIndex);

        return new CallableTypeNode(identifier, parameters, returnType);
    }

    private parseCallableParameter(tokens: TokenIterator): CallableTypeParameterNode {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();
        const type = this.parse(tokens);
        const isReference = tokens.tryConsumeTokenType(TokenType.TOKEN_REFERENCE);
        const isVariadic = tokens.tryConsumeTokenType(TokenType.TOKEN_VARIADIC);

        let parameterName: string;

        if (tokens.isCurrentTokenType(TokenType.TOKEN_VARIABLE)) {
            parameterName = tokens.currentTokenValue();
            tokens.consumeTokenType(TokenType.TOKEN_VARIABLE);
        } else {
            parameterName = '';
        }

        const isOptional = tokens.tryConsumeTokenType(TokenType.TOKEN_EQUAL);

        return this.enrichWithAttributes(
            tokens,
            new CallableTypeParameterNode(type, isReference, isVariadic, parameterName, isOptional),
            startLine,
            startIndex,
        );
    }

    private parseCallableReturnType(tokens: TokenIterator): TypeNode {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();

        if (tokens.isCurrentTokenType(TokenType.TOKEN_NULLABLE)) {
            return this.parseNullable(tokens);
        } else if (tokens.tryConsumeTokenType(TokenType.TOKEN_OPEN_PARENTHESES)) {
            let type = this.subParse(tokens);

            tokens.consumeTokenType(TokenType.TOKEN_CLOSE_PARENTHESES);

            if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                type = this.tryParseArrayOrOffsetAccess(tokens, type);
            }

            return type;
        } else if (tokens.tryConsumeTokenType(TokenType.TOKEN_THIS_VARIABLE)) {
            let type: TypeNode = new ThisTypeNode();

            if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                type = this.tryParseArrayOrOffsetAccess(tokens, this.enrichWithAttributes(
                    tokens,
                    type,
                    startLine,
                    startIndex,
                ));
            }

            return type;
        } else {
            const currentTokenValue = tokens.currentTokenValue();
            tokens.pushSavePoint(); // because of ConstFetchNode

            if (tokens.tryConsumeTokenType(TokenType.TOKEN_IDENTIFIER)) {
                let type: TypeNode = new IdentifierTypeNode(currentTokenValue);

                if (!tokens.isCurrentTokenType(TokenType.TOKEN_DOUBLE_COLON)) {
                    if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_ANGLE_BRACKET)) {
                        type = this.parseGeneric(
                            tokens,
                            this.enrichWithAttributes(
                                tokens,
                                type as IdentifierTypeNode,
                                startLine,
                                startIndex,
                            ),
                        );

                        if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                            type = this.tryParseArrayOrOffsetAccess(
                                tokens,
                                this.enrichWithAttributes(
                                    tokens,
                                    type,
                                    startLine,
                                    startIndex,
                                ),
                            );
                        }
                    } else if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                        type = this.tryParseArrayOrOffsetAccess(
                            tokens,
                            this.enrichWithAttributes(
                                tokens,
                                type,
                                startLine,
                                startIndex,
                            ),
                        );
                    } else if ([
                        'array',
                        'list',
                        'object',
                    ].includes((type as IdentifierTypeNode).name) && tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_CURLY_BRACKET) && !tokens.isPrecededByHorizontalWhitespace()) {
                        if ((type as IdentifierTypeNode).name === 'object') {
                            type = this.parseObjectShape(tokens);
                        } else {
                            type = this.parseArrayShape(
                                tokens,
                                this.enrichWithAttributes(
                                    tokens,
                                    type,
                                    startLine,
                                    startIndex,
                                ),
                                (type as IdentifierTypeNode).name as ArrayShapeNodeKind,
                            );
                        }

                        if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                            type = this.tryParseArrayOrOffsetAccess(tokens, this.enrichWithAttributes(tokens, type, startLine, startIndex));
                        }
                    }

                    return type;
                } else {
                    tokens.rollback(); // because of ConstFetchNode
                }
            } else {
                tokens.dropSavePoint(); // because of ConstFetchNode
            }
        }

        const currentTokenValue = tokens.currentTokenValue();
        const currentTokenType = tokens.currentTokenType();
        const currentTokenOffset = tokens.currentTokenOffset();
        const currentTokenLine = tokens.currentTokenLine();

        if (this.constExprParser === null) {
            throw new ParserException(
                currentTokenValue,
                currentTokenType,
                currentTokenOffset,
                TokenType.TOKEN_IDENTIFIER,
                null,
                currentTokenLine,
            );
        }

        try {
            const constExpr = this.constExprParser.parse(tokens, true);

            if (constExpr instanceof ConstExprArrayNode) {
                throw new ParserException(
                    currentTokenValue,
                    currentTokenType,
                    currentTokenOffset,
                    TokenType.TOKEN_IDENTIFIER,
                    null,
                    currentTokenLine,
                );
            }

            let type: TypeNode = new ConstTypeNode(constExpr);

            if (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                type = this.tryParseArrayOrOffsetAccess(
                    tokens,
                    this.enrichWithAttributes(
                        tokens,
                        type,
                        startLine,
                        startIndex,
                    ),
                );
            }

            return type;
        } catch (e) {
            if (e instanceof LogicException) {
                throw new ParserException(
                    currentTokenValue,
                    currentTokenType,
                    currentTokenOffset,
                    TokenType.TOKEN_IDENTIFIER,
                    null,
                    currentTokenLine,
                );
            }

            throw e;
        }
    }

    private tryParseCallable(tokens: TokenIterator, identifier: IdentifierTypeNode): TypeNode {
        let type: TypeNode;

        try {
            tokens.pushSavePoint();
            type = this.parseCallable(tokens, identifier);
            tokens.dropSavePoint();
        } catch (e) {
            if (e instanceof ParserException) {
                tokens.rollback();
                type = identifier;
            } else {
                throw e;
            }
        }

        return type;
    }

    private tryParseArrayOrOffsetAccess(tokens: TokenIterator, type: TypeNode): TypeNode {
        const startLine = type.getAttribute(Attribute.START_LINE);
        const startIndex = type.getAttribute(Attribute.START_INDEX);

        try {
            while (tokens.isCurrentTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET)) {
                tokens.pushSavePoint();

                const canBeOffsetAccessType = !tokens.isPrecededByHorizontalWhitespace();
                tokens.consumeTokenType(TokenType.TOKEN_OPEN_SQUARE_BRACKET);

                if (canBeOffsetAccessType && !tokens.isCurrentTokenType(TokenType.TOKEN_CLOSE_SQUARE_BRACKET)) {
                    const offset = this.parse(tokens);
                    tokens.consumeTokenType(TokenType.TOKEN_CLOSE_SQUARE_BRACKET);
                    tokens.dropSavePoint();
                    type = new OffsetAccessTypeNode(type, offset);

                    if (startLine !== null && startIndex !== null) {
                        type = this.enrichWithAttributes(
                            tokens,
                            type,
                            startLine,
                            startIndex,
                        );
                    }
                } else {
                    tokens.consumeTokenType(TokenType.TOKEN_CLOSE_SQUARE_BRACKET);
                    tokens.dropSavePoint();
                    type = new ArrayTypeNode(type);

                    if (startLine !== null && startIndex !== null) {
                        type = this.enrichWithAttributes(
                            tokens,
                            type,
                            startLine,
                            startIndex,
                        );
                    }
                }
            }
        } catch (e) {
            if (e instanceof ParserException) {
                tokens.rollback();
            } else {
                throw e;
            }
        }

        return type;
    }

    private parseArrayShape(tokens: TokenIterator, type: TypeNode, kind: ArrayShapeNodeKind): ArrayShapeNode {
        tokens.consumeTokenType(TokenType.TOKEN_OPEN_CURLY_BRACKET);

        const items: ArrayShapeItemNode[] = [];
        let sealed = true;

        do {
            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

            if (tokens.tryConsumeTokenType(TokenType.TOKEN_CLOSE_CURLY_BRACKET)) {
                return new ArrayShapeNode(items, true, kind);
            }

            if (tokens.tryConsumeTokenType(TokenType.TOKEN_VARIADIC)) {
                sealed = false;
                tokens.tryConsumeTokenType(TokenType.TOKEN_COMMA);

                break;
            }

            items.push(this.parseArrayShapeItem(tokens));

            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        } while (tokens.tryConsumeTokenType(TokenType.TOKEN_COMMA));

        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        tokens.consumeTokenType(TokenType.TOKEN_CLOSE_CURLY_BRACKET);

        return new ArrayShapeNode(items, sealed, kind);
    }

    private parseArrayShapeItem(tokens: TokenIterator): ArrayShapeItemNode {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();

        try {
            tokens.pushSavePoint();

            const key = this.parseArrayShapeKey(tokens);
            const optional = tokens.tryConsumeTokenType(TokenType.TOKEN_NULLABLE);
            tokens.consumeTokenType(TokenType.TOKEN_COLON);

            const value = this.parse(tokens);
            tokens.dropSavePoint();

            return this.enrichWithAttributes(
                tokens,
                new ArrayShapeItemNode(key, optional, value),
                startLine,
                startIndex,
            );
        } catch (e) {
            if (e instanceof ParserException) {
                tokens.rollback();

                const value = this.parse(tokens);

                return this.enrichWithAttributes(
                    tokens,
                    new ArrayShapeItemNode(null, false, value),
                    startLine,
                    startIndex,
                );
            } else {
                throw e;
            }
        }
    }

    private parseArrayShapeKey(tokens: TokenIterator): ConstExprIntegerNode | ConstExprStringNode | IdentifierTypeNode {
        const startIndex = tokens.currentTokenIndex();
        const startLine = tokens.currentTokenLine();
        let key: ConstExprIntegerNode | ConstExprStringNode | QuoteAwareConstExprStringNode | IdentifierTypeNode;

        if (tokens.isCurrentTokenType(TokenType.TOKEN_INTEGER)) {
            key = new ConstExprIntegerNode(str_replace('_', '', tokens.currentTokenValue()) as string);
            tokens.next();
        } else if (tokens.isCurrentTokenType(TokenType.TOKEN_SINGLE_QUOTED_STRING)) {
            if (this.quoteAwareConstExprString) {
                key = new QuoteAwareConstExprStringNode(StringUnescaper.unescapeString(tokens.currentTokenValue()), QuoteAwareConstExprStringNodeQuoted.SINGLE_QUOTED);
            } else {
                key = new ConstExprStringNode(trim(tokens.currentTokenValue(), "'"));
            }

            tokens.next();
        } else if (tokens.isCurrentTokenType(TokenType.TOKEN_DOUBLE_QUOTED_STRING)) {
            if (this.quoteAwareConstExprString) {
                key = new QuoteAwareConstExprStringNode(StringUnescaper.unescapeString(tokens.currentTokenValue()), QuoteAwareConstExprStringNodeQuoted.DOUBLE_QUOTED);
            } else {
                key = new ConstExprStringNode(trim(tokens.currentTokenValue(), '"'));
            }

            tokens.next();
        } else {
            key = new IdentifierTypeNode(tokens.currentTokenValue());
            tokens.consumeTokenType(TokenType.TOKEN_IDENTIFIER);
        }

        return this.enrichWithAttributes(
            tokens,
            key,
            startLine,
            startIndex,
        );
    }

    private parseObjectShape(tokens: TokenIterator): ObjectShapeNode {
        tokens.consumeTokenType(TokenType.TOKEN_OPEN_CURLY_BRACKET);

        const items: ObjectShapeItemNode[] = [];

        do {
            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);

            if (tokens.tryConsumeTokenType(TokenType.TOKEN_CLOSE_CURLY_BRACKET)) {
                return new ObjectShapeNode(items);
            }

            items.push(this.parseObjectShapeItem(tokens));

            tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        } while (tokens.tryConsumeTokenType(TokenType.TOKEN_COMMA));

        tokens.tryConsumeTokenType(TokenType.TOKEN_PHPDOC_EOL);
        tokens.consumeTokenType(TokenType.TOKEN_CLOSE_CURLY_BRACKET);

        return new ObjectShapeNode(items);
    }

    private parseObjectShapeItem(tokens: TokenIterator): ObjectShapeItemNode {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();

        const key = this.parseObjectShapeKey(tokens);
        const optional = tokens.tryConsumeTokenType(TokenType.TOKEN_NULLABLE);
        tokens.consumeTokenType(TokenType.TOKEN_COLON);

        const value = this.parse(tokens);

        return this.enrichWithAttributes(tokens, new ObjectShapeItemNode(key, optional, value), startLine, startIndex);
    }

    private parseObjectShapeKey(tokens: TokenIterator): ConstExprStringNode | IdentifierTypeNode {
        const startLine = tokens.currentTokenLine();
        const startIndex = tokens.currentTokenIndex();
        let key: QuoteAwareConstExprStringNode | ConstExprStringNode | IdentifierTypeNode;

        if (tokens.isCurrentTokenType(TokenType.TOKEN_SINGLE_QUOTED_STRING)) {
            if (this.quoteAwareConstExprString) {
                key = new QuoteAwareConstExprStringNode(StringUnescaper.unescapeString(tokens.currentTokenValue()), QuoteAwareConstExprStringNodeQuoted.SINGLE_QUOTED);
            } else {
                key = new ConstExprStringNode(trim(tokens.currentTokenValue(), "'"));
            }

            tokens.next();
        } else if (tokens.isCurrentTokenType(TokenType.TOKEN_DOUBLE_QUOTED_STRING)) {
            if (this.quoteAwareConstExprString) {
                key = new QuoteAwareConstExprStringNode(StringUnescaper.unescapeString(tokens.currentTokenValue()), QuoteAwareConstExprStringNodeQuoted.DOUBLE_QUOTED);
            } else {
                key = new ConstExprStringNode(trim(tokens.currentTokenValue(), '"'));
            }

            tokens.next();
        } else {
            key = new IdentifierTypeNode(tokens.currentTokenValue());
            tokens.consumeTokenType(TokenType.TOKEN_IDENTIFIER);
        }

        return this.enrichWithAttributes(tokens, key, startLine, startIndex);
    }
}
