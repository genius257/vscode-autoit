import FqsenResolver from "./FqsenResolver";
import TypeParser from "./Parser/TypeParser";
import Lexer from "./Lexer/Lexer";
import ConstExprParser from "./Parser/ConstExprParser";
import Context from "./Types/Context";
import TypeNode from "./Ast/Type/TypeNode";

export default class TypeResolver {
    private static readonly OPERATOR_NAMESPACE = '\\';

    /*
    private keywords: Record<string, TypeLike> = {
        'string': String_,
        'class-string': ClassString,
        'interface-string': InterfaceString,
        'html-escaped-string': HtmlEscapedString,
        'lowercase-string': LowercaseString,
        'non-empty-lowercase-string': NonEmptyLowercaseString,
        'non-empty-string': NonEmptyString,
        'numeric-string': NumericString,
        'numeric': Numeric_,
        'trait-string': TraitString,
        'int': Integer,
        'integer': Integer,
        'positive-int': PositiveInteger,
        'negative-int': NegativeInteger,
        'bool': Boolean,
        'boolean': Boolean,
        'real': Float_,
        'float': Float_,
        'double': Float_,
        'object': Object_,
        'mixed': Mixed_,
        'array': Array_,
        'array-key': ArrayKey,
        'resource': Resource_,
        'void': Void_,
        'null': Null_,
        'scalar': Scalar,
        'callback': Callable_,
        'callable': Callable_,
        'callable-string': CallableString,
        'false': False_,
        'true': True_,
        'literal-string': LiteralString,
        'self': Self_,
        '$this': This,
        'static': Static_,
        'parent': Parent_,
        'iterable': Iterable_,
        'never': Never_,
        'list': List_,
        'non-empty-list': NonEmptyList,
    }
    */

    private readonly fqsenResolver: FqsenResolver;

    private readonly typeParser: TypeParser;

    private readonly lexer: Lexer;

    public constructor(fqsenResolver: FqsenResolver|null = null) {
        this.fqsenResolver = fqsenResolver ?? new FqsenResolver();
        this.typeParser = new TypeParser(new ConstExprParser());
        this.lexer = new Lexer();
    }

    public resolve(type: string, context: Context|null = null): Type {
        type = type.trim();
        if (type === '') {
            throw new Error(`Attempted to resolve "${type}" but it appears to be empty`);
        }

        if (context === null) {
            context = new Context('');
        }

        const tokens = this.lexer.tokenize(type);
        const tokenIterator = new TokenIterator(tokens);

        const ast = this.parse(tokenIterator);
        type = this.createType(ast, context);

        return this.tryParseRemainingCompoundTypes(tokenIterator, context, type);
    }

    public createType(type: TypeNode|null, context: Context): Type {
        if (type === null) {
            return new Mixed();
        }

        switch (type.constructor) {
            case ArrayTypeNode:
                return new Array_(
                    this.createType(type.type, context)
                );
            case ArrayShapeNode:
                return new ArrayShape(
                    ...type.items.map(() => new ArrayShapeItem(
                        item.keyName.toString(),
                        this.createType(item.valueType, context),
                        item.optional
                    ))
                );
            case CallableTypeNode:
                return this.createFromCallable(type, context);
            case ConstTypeNode:
                return this.createFromConst(type, context);
            case GenericTypeNode:
                return this.createFromGeneric(type, context);
            case IdentifierTypeNode:
                return this.resolveSingleType(type.name, context);
            case IntersectionTypeNode:
                return new Intersection(
                    type.types.map((nestedType: TypeNode) => {
                        const type = this.createType(nestedType, context);
                        if (type instanceof AggregatedType) {
                            return new Expression(type);
                        }

                        return type;
                    }).filter(v => v)
                );
            case NullableTypeNode:
                const nestedType = this.createType(type.type, context);
                return new Nullable;
            case UnionTypeNode:
                return new Compound(
                    type.types.map((nestedType: TypeNode) => {
                        const type = this.createType(nestedType, context);
                        if (type instanceof AggregatedType) {
                            return new Expression(type);
                        }

                        return type;
                    }).filter(v => v)
                );
            case ThisTypeNode:
                return new this();
            case ConditionalTypeNode:
            case ConditionalTypeForParameterNode:
            case OffsetAccesTypeNode:
            default:
                return new Mixed();
        }
    }

    // private createFromGeneric(type: GenericTypeNode, context: Context): Type

    // private createFromCallable(type: CallableTypeNode, context: Context): Callable

    // private createFromConst(type: ConstTypeNode, context: Context): Type

    // private resolveSingleType(type: string, context: Context): object

    // public addKeyword(keyword: string, typeClassName: string): void

    // private isKeyword(type: string): boolean

    // private isPartialStructuralElementName(type: string): boolean

    // private isFqsen(type: string): boolean

    // private resolveKeyword(type: string): Type

    // private resolveTypedObject(type: string, context: Context|null = null): Object_

    // private createArray(typeNodes: TypeNode[], context: Context): Array_

    // private validArrayKeyType(type: Type|null): boolean

    private parse(tokenIterator): TypeNode {
        try {
            const ast = this.typeParser.parse(tokenIterator);
            return ast;
        } catch (e) {
            if (e instanceof ParserException) {
                throw new Error(e.getMessage());
            }
            throw e;
        }
    }

    // private tryParseRemainingCompoundTypes(tokenIterator: TokenIterator, context: Context, type: Type): Type
}
