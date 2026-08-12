import FqsenResolver from './FqsenResolver';
import TypeParser from './Parser/TypeParser';
import Lexer, { TokenType } from './Lexer/Lexer';
import ConstExprParser from './Parser/ConstExprParser';
import Context from './Types/Context';
import TypeNode from './Ast/Type/TypeNode';
import TokenIterator, { ParserException } from './Parser/TokenIterator';
import Mixed from './Types/Mixed';
import Type from './Type';
import Compound from './Types/Compound';
import Intersection from './Types/Intersection';
import ArrayTypeNode from './Ast/Type/ArrayTypeNode';
import ArrayShapeNode from './Ast/Type/ArrayShapeNode';
import CallableTypeNode from './Ast/Type/CallableTypeNode';
import ConstTypeNode from './Ast/Type/ConstTypeNode';
import GenericTypeNode from './Ast/Type/GenericTypeNode';
import IdentifierTypeNode from './Ast/Type/IdentifierTypeNode';
import IntersectionTypeNode from './Ast/Type/IntersectionTypeNode';
import NullableTypeNode from './Ast/Type/NullableTypeNode';
import UnionTypeNode from './Ast/Type/UnionTypeNode';
import ThisTypeNode from './Ast/Type/ThisTypeNode';
import ConditionalTypeNode from './Ast/Type/ConditionalTypeNode';
import ConditionalTypeForParameterNode from './Ast/Type/ConditionalTypeForParameterNode';
import OffsetAccessTypeNode from './Ast/Type/OffsetAccessTypeNode';
import Array_ from './Types/Array_';
import ArrayShapeItem from './PseudoTypes/ArrayShapeItem';
import ArrayShape from './PseudoTypes/ArrayShape';
import Expression from './Types/Expression';
import String_ from './Types/String_';
import Integer from './Types/Integer';
import Mixed_ from './Types/Mixed_';
import ClassString from './Types/ClassString';
import InterfaceString from './Types/InterfaceString';
import HtmlEscapedString from './PseudoTypes/HtmlEscapedString';
import LowercaseString from './PseudoTypes/LowercaseString';
import NonEmptyLowercaseString from './PseudoTypes/NonEmptyLowercaseString';
import NonEmptyString from './PseudoTypes/NonEmptyString';
import NumericString from './PseudoTypes/NumericString';
import Numeric_ from './PseudoTypes/Numeric_';
import TraitString from './PseudoTypes/TraitString';
import PositiveInteger from './PseudoTypes/PositiveInteger';
import NegativeInteger from './PseudoTypes/NegativeInteger';
import Boolean from './Types/Boolean';
import Float_ from './Types/Float_';
import Object_ from './Types/Object_';
import ArrayKey from './Types/ArrayKey';
import Resource_ from './Types/Resource_';
import Void_ from './Types/Void_';
import Null_ from './Types/Null_';
import Scalar from './Types/Scalar';
import Callable_ from './Types/Callable_';
import CallableString from './PseudoTypes/CallableString';
import False_ from './PseudoTypes/False_';
import True_ from './PseudoTypes/True_';
import LiteralString from './PseudoTypes/LiteralString';
import Self_ from './Types/Self_';
import This from './Types/This';
import Static_ from './Types/Static_';
import Parent_ from './Types/Parent_';
import Iterable_ from './Types/Iterable_';
import Never_ from './Types/Never_';
import List_ from './PseudoTypes/List_';
import NonEmptyList from './PseudoTypes/NonEmptyList';
import AggregatedType from './Types/AggregatedType';
import { sprintf, strpos, strtolower, trim } from 'locutus/php/strings';
import IntegerRange from './PseudoTypes/IntegerRange';
import { array_key_exists } from 'locutus/php/array';
import Collection from './Types/Collection';
import ConstFetchNode from './Ast/ConstExpr/ConstFetchNode';
import ConstExprStringNode from './Ast/ConstExpr/ConstExprStringNode';
import ConstExprFloatNode from './Ast/ConstExpr/ConstExprFloatNode';
import ConstExprIntegerNode from './Ast/ConstExpr/ConstExprIntegerNode';
import IntegerValue from './PseudoTypes/IntegerValue';
import FloatValue from './PseudoTypes/FloatValue';
import StringValue from './PseudoTypes/StringValue';
import ConstExpression from './PseudoTypes/ConstExpression';
import Nullable from './Types/Nullable';
import CallableParameter from './Types/CallableParameter';
import Deprecation from './Deprecation';
import { Constructor } from '@utils/trait';
import CallableTypeParameterNode from './Ast/Type/CallableTypeParameterNode';

export class RuntimeException extends Error {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public constructor(message: string = '', _code: number = 0, _previous: Error | null = null) {
        super(message);

        // restore prototype chain
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto);
    }
}

export class InvalidArgumentException extends Error {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public constructor(message: string = '', _code: number = 0, _previous: Error | null = null) {
        super(message);

        // restore prototype chain
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto);
    }
}

export default class TypeResolver {
    private readonly OPERATOR_NAMESPACE = '\\';

    private keywords: Record<string, Constructor<Type>> = {
        string: String_,
        'class-string': ClassString,
        'interface-string': InterfaceString,
        'html-escaped-string': HtmlEscapedString,
        'lowercase-string': LowercaseString,
        'non-empty-lowercase-string': NonEmptyLowercaseString,
        'non-empty-string': NonEmptyString,
        'numeric-string': NumericString,
        numeric: Numeric_,
        'trait-string': TraitString,
        'int': Integer,
        integer: Integer,
        'positive-int': PositiveInteger,
        'negative-int': NegativeInteger,
        bool: Boolean,
        'boolean': Boolean,
        real: Float_,
        'float': Float_,
        'double': Float_,
        object: Object_,
        mixed: Mixed_,
        array: Array_,
        'array-key': ArrayKey,
        resource: Resource_,
        'void': Void_,
        'null': Null_,
        scalar: Scalar,
        callback: Callable_,
        callable: Callable_,
        'callable-string': CallableString,
        'false': False_,
        'true': True_,
        'literal-string': LiteralString,
        self: Self_,
        $this: This,
        'static': Static_,
        parent: Parent_,
        iterable: Iterable_,
        never: Never_,
        list: List_,
        'non-empty-list': NonEmptyList,
    };

    private readonly fqsenResolver: FqsenResolver;

    private readonly typeParser: TypeParser;

    private readonly lexer: Lexer;

    public constructor(fqsenResolver: FqsenResolver | null = null) {
        this.fqsenResolver = fqsenResolver ?? new FqsenResolver();
        this.typeParser = new TypeParser(new ConstExprParser());
        this.lexer = new Lexer();
    }

    /**
     * Analyzes the given type and returns the FQCN variant.
     *
     * When a type is provided this method checks whether it is not a keyword or
     * Fully Qualified Class Name. If so it will use the given namespace and
     * aliases to expand the type to a FQCN representation.
     *
     * This method only works as expected if the namespace and aliases are set;
     * no dynamic reflection is being performed here.
     */
    public resolve(type: string, context: Context | null = null): Type {
        type = type.trim();

        if (type === '') {
            throw new InvalidArgumentException(`Attempted to resolve "${type}" but it appears to be empty`);
        }

        context ??= new Context('');

        const tokens = this.lexer.tokenize(type);
        const tokenIterator = new TokenIterator(tokens);

        const ast = this.parse(tokenIterator);
        const _type = this.createType(ast, context);

        return this.tryParseRemainingCompoundTypes(
            tokenIterator,
            context,
            _type,
        );
    }

    public createType(type: TypeNode | null, context: Context): Type {
        if (type === null) {
            return new Mixed();
        }

        switch (type.constructor) {
            case ArrayTypeNode:
                return new Array_(
                    this.createType((type as ArrayTypeNode).type, context),
                );
            case ArrayShapeNode:
                return new ArrayShape(
                    ...(type as ArrayShapeNode).items.map((item) => new ArrayShapeItem(
                        item.keyName?.toString() ?? '',
                        this.createType(item.valueType, context),
                        item.optional,
                    )),
                );
            case CallableTypeNode:
                return this.createFromCallable(type as CallableTypeNode, context);
            case ConstTypeNode:
                return this.createFromConst(type as ConstTypeNode, context);
            case GenericTypeNode:
                return this.createFromGeneric(type as GenericTypeNode, context);
            case IdentifierTypeNode:
                return this.resolveSingleType((type as IdentifierTypeNode).name, context);
            case IntersectionTypeNode:
                return new Intersection(
                    (type as IntersectionTypeNode).types.map((nestedType: TypeNode) => {
                        const type = this.createType(nestedType, context);

                        if (type instanceof AggregatedType) {
                            return new Expression(type);
                        }

                        return type;
                    }),
                );
            case NullableTypeNode:
            {
                const nestedType = this.createType((type as NullableTypeNode).type, context);

                return new Nullable(nestedType);
            }
            case UnionTypeNode:
                return new Compound(
                    (type as UnionTypeNode).types.map((nestedType: TypeNode) => {
                        const type = this.createType(nestedType, context);

                        if (type instanceof AggregatedType) {
                            return new Expression(type);
                        }

                        return type;
                    }),
                );
            case ThisTypeNode:
                return new This();
            case ConditionalTypeNode:
            case ConditionalTypeForParameterNode:
            case OffsetAccessTypeNode:
            default:
                return new Mixed();
        }
    }

    private createFromGeneric(type: GenericTypeNode, context: Context): Type {
        switch (strtolower(type.type.name)) {
            case 'array':
                return this.createArray(type.genericTypes, context);
            case 'class-string':
            {
                const subType = this.createType(type.genericTypes[0] ?? null, context);

                if (!(subType instanceof Object_) || subType.getFqsen() === null) {
                    throw new RuntimeException(
                        subType.toString() + ' is not a class string',
                    );
                }

                return new ClassString(
                    subType.getFqsen(),
                );
            }
            case 'interface-string':
            {
                const subType = this.createType(type.genericTypes[0] ?? null, context);

                if (!(subType instanceof Object_) || subType.getFqsen() === null) {
                    throw new RuntimeException(
                        subType.toString() + ' is not a class string',
                    );
                }

                return new InterfaceString(
                    subType.getFqsen(),
                );
            }
            case 'list':
                return new List_(
                    this.createType(type.genericTypes[0] ?? null, context),
                );
            case 'non-empty-list':
                return new NonEmptyList(
                    this.createType(type.genericTypes[0] ?? null, context),
                );
            case 'int':
                if (type.genericTypes[0] === undefined || type.genericTypes[1] === undefined) {
                    throw new RuntimeException('int<min,max> has not the correct format');
                }

                return new IntegerRange(
                    Number.parseInt(type.genericTypes[0].toString()),
                    Number.parseInt(type.genericTypes[1].toString()),
                );
            case 'iterable':
                return new Iterable_(
                    ...type.genericTypes.map((genericType: TypeNode) => this.createType(genericType, context)).reverse(),
                );
            default:
            {
                const collectionType = this.createType(type.type, context);

                if (!(collectionType instanceof Object_)) {
                    throw new RuntimeException(sprintf('%s is not a collection', collectionType).toString());
                }

                const genericTypes = type.genericTypes.map((genericType: TypeNode) => this.createType(genericType, context)).reverse();

                if (genericTypes[0] === undefined) {
                    throw new RuntimeException('A collection type argument is missing');
                }

                return new Collection(
                    collectionType.getFqsen(),
                    genericTypes[0],
                    genericTypes[1] ?? null,
                );
            }
        }
    }

    private createFromCallable(type: CallableTypeNode, context: Context): Callable_ {
        return new Callable_(
            type.parameters.map((param: CallableTypeParameterNode) => {
                return new CallableParameter(
                    this.createType(param.type, context),
                    param.parameterName !== '' ? trim(param.parameterName, '$') : null,
                    param.isReference,
                    param.isVariadic,
                    param.isOptional,
                );
            }),
            this.createType(type.returnType, context),
        );
    }

    private createFromConst(type: ConstTypeNode, context: Context): Type {
        switch (true) {
            case type.constExpr instanceof ConstExprIntegerNode:
                return new IntegerValue(Number.parseInt(type.constExpr.value));
            case type.constExpr instanceof ConstExprFloatNode:
                return new FloatValue(Number.parseFloat(type.constExpr.value));
            case type.constExpr instanceof ConstExprStringNode:
                return new StringValue(type.constExpr.value);
            case type.constExpr instanceof ConstFetchNode:
                return new ConstExpression(
                    this.resolve(type.constExpr.className, context),
                    type.constExpr.name,
                );
            default:
                throw new RuntimeException(sprintf('Unsupported constant type %s', type.constructor.name).toString());
        }
    }

    private resolveSingleType(type: string, context: Context): Type | Array_ | Object_ {
        switch (true) {
            case this.isKeyword(type):
                return this.resolveKeyword(type);
            case this.isFqsen(type):
                return this.resolveTypedObject(type);
            case this.isPartialStructuralElementName(type):
                return this.resolveTypedObject(type, context);
            default:
                // I haven't got the foggiest how the logic would come here but added this as a defense.
                throw new RuntimeException(
                    'Unable to resolve type "' + type + '", there is no known method to resolve it',
                );
        }
    }

    public addKeyword(keyword: string, typeClassName: Constructor<Type>): void {
        this.keywords[keyword] = typeClassName;
    }

    private isKeyword(type: string): boolean {
        return array_key_exists(strtolower(type), this.keywords);
    }

    private isPartialStructuralElementName(type: string): boolean {
        return !type.startsWith(this.OPERATOR_NAMESPACE) && !this.isKeyword(type);
    }

    private isFqsen(type: string): boolean {
        return strpos(type, this.OPERATOR_NAMESPACE, 0) === 0;
    }

    private resolveKeyword(type: string): Type {
        const className = this.keywords[strtolower(type)];

        if (className === undefined) {
            throw new RuntimeException('Unable to resolve type "' + type + '"');
        }

        return new className();
    }

    private resolveTypedObject(type: string, context: Context | null = null): Object_ {
        return new Object_(this.fqsenResolver.resolve(type, context));
    }

    private createArray(typeNodes: TypeNode[], context: Context): Array_ {
        const types = typeNodes.map((node: TypeNode) => this.createType(node, context)).reverse();

        if (types[1] === undefined) {
            return new Array_(...types);
        }

        if (this.validArrayKeyType(types[1]) || types[1] instanceof ArrayKey) {
            return new Array_(...types);
        }

        if (types[1] instanceof Compound && [...types[1].getIterator()].length === 2) {
            if (this.validArrayKeyType(types[1].get(0)) && this.validArrayKeyType(types[1].get(1))) {
                return new Array_(...types);
            }
        }

        throw new RuntimeException('An array can have only integers or strings as keys');
    }

    private validArrayKeyType(type: Type | null): boolean {
        return type instanceof String_ || type instanceof Integer;
    }

    private parse(tokenIterator: TokenIterator): TypeNode {
        try {
            const ast = this.typeParser.parse(tokenIterator);

            return ast;
        } catch (e) {
            if (e instanceof ParserException) {
                throw new RuntimeException(e.getMessage(), 0, e);
            }

            throw e;
        }
    }

    private tryParseRemainingCompoundTypes(
        tokenIterator: TokenIterator,
        context: Context,
        type: Type,
    ): Type {
        if (
            tokenIterator.isCurrentTokenType(TokenType.TOKEN_UNION) ||
            tokenIterator.isCurrentTokenType(TokenType.TOKEN_INTERSECTION)
        ) {
            Deprecation.trigger(
                'phpdocumentor/type-resolver',
                'https://github.com/phpDocumentor/TypeResolver/issues/184',
                'Legacy nullable type detected, please update your code as you are using nullable types in a docblock. support will be removed in v2.0.0',
            );
        }

        let $continue = true;

        while ($continue) {
            $continue = false;

            while (tokenIterator.tryConsumeTokenType(TokenType.TOKEN_UNION)) {
                const ast = this.parse(tokenIterator);
                const type2 = this.createType(ast, context);
                type = new Compound([type, type2]);
                $continue = true;
            }

            while (tokenIterator.tryConsumeTokenType(TokenType.TOKEN_INTERSECTION)) {
                const ast = this.typeParser.parse(tokenIterator);
                const type2 = this.createType(ast, context);
                type = new Intersection([type, type2]);
                $continue = true;
            }
        }

        return type;
    }
}
