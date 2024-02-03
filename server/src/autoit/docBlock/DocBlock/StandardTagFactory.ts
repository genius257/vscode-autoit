import Tag from "./Tag";
import TagFactory from "./TagFactory";
import Author from "./Tags/Author";
import Factory from "./Tags/Factory/Factory";
import {FormalParameter} from "autoit3-pegjs";

type TagLike = {new (...$args: any[]): Tag, prototype: Tag}

// https://github.com/phpDocumentor/ReflectionDocBlock/blob/master/src/DocBlock/StandardTagFactory.php

export default class StandardTagFactory extends TagFactory {
    /** PCRE regular expression matching a tag name. */
    public static readonly REGEX_TAGNAME = '[\\w\\-_\\\\:]+';

    private tagHandlerMappings: Record<string, TagLike|Factory> = {
        'author': Author,
        // 'covers': Covers,
        // 'deprecated': Deprecated,
        // 'example': Example,
        // 'link': LinkTag,
        // 'method': Method,
        // 'param': Param,
        // 'property-:d' => PropertyRead,
        // 'property': Property,
        // 'property-:te' => PropertyWrite,
        // 'return': Return_,
        // 'see': SeeTag,
        // 'since': Since,
        // 'source': Source,
        // 'throw': Throws,
        // 'throws': Throws,
        // 'uses': Uses,
        // 'var': Var_,
        // 'version': Version,
    };

    private annotationMappings: Record<string, TagLike> = {};

    /**
     * A lazy-loading cache containing parameters for each tagHandler that has been used.
     */
    private tagHandlerParameterCache: FormalParameter[] = [];

    private fqsenResolver: unknown; //FIXME

    /**
     * An array representing a simple Service Locator where we can store parameters and services that can be inserted into the Factory Methods of Tag Handlers.
     */
    private serviceLocator: unknown[] = [];

    public constructor(fqsenResolver: unknown, tagHandlers: Record<string, TagLike>|null = null) {
        super();

        this.fqsenResolver = fqsenResolver;
        if (tagHandlers !== null) {
            this.tagHandlerMappings = tagHandlers;
        }

        this.addService(fqsenResolver, FqsenResolver);
    }

    public create(tagLine: string, context?: unknown): BaseTag {
        if (context === undefined) {
            context = TypeContext('');
        }

        const [tagName, tagBody] = this.extractTagParts(tagLine);

        return this.createTag(tagBody.trim(), tagName, context);
    }

    public addParameter(name: string, value: unknown): void {
        this.serviceLocator[name] = value;
    }

    public addService(service: object, alias: string|null = null): void {
        this.serviceLocator[alias ?? service.name] = service;
    }

    public registerTagHandler(tagName: string, handler: Factory | TagLike): void {
        if (tagName.includes('\\') && tagName !== '\\') {
            throw new Error('A namespaced tag must have a leading backslash as it must be fully qualified');
        }

        if (handler instanceof Factory) { //FIXME
            this.tagHandlerMappings[tagName] = handler;

            return;
        }

        this.tagHandlerMappings[tagName] = handler;
    }

    private extractTagParts(tagLine: string): string[] {
        const matches = tagLine.match(new RegExp(`/^@(${StandardTagFactory.REGEX_TAGNAME})((?:[\\s\\(\\{])\\s*([^\\s].*)|$)`, 'us'));

        if (matches === null) {
            throw new Error(`The tag "${tagLine}" does not seem to be wellformed, please check it for errors`);
        }

        if (matches.length < 3) {
            matches.push('');
        }

        return matches.slice(1);
    }

    private createTag(body: string, name: string, context: TypeContext): Tag {
        const handlerClassName = this.findHandlerClassName(name, context);
        const _arguments = this.getArgumentsForParametersFromWiring(
            this.fetchParametersForHandlerFacotyMethod(handlerClassName),
            this.getServiceLocationWithDynami9cParameters(context, name, body),
        );

        if ('tagLine' in _arguments) {
            arguments['tagLine'] = `@${name} ${body}`;
        }

        try {
            const tag = handlerClassName.create(...arguments);

            return tag ?? InvalidTag.create(body, name);
        } catch (e) {
            return InvalidTag.create(body, name).withError(e);
        }
    }

    private findHandlerClassName(tagName: string, context: TypeContext): TagLike|Factory {
        let handlerClassName: TagLike|Factory = Generic;
        if (tagName in this.tagHandlerMappings) {
            handlerClassName = this.tagHandlerMappings[tagName];
        } else if (this.isAnnotation(tagName)) {
            // TODO: Annotation support is planned for a later stage and as such is disabled for now
            tagName = this.fqsenResolver.resolve(tagName, context);
            if (tagName in this.annotationMappings) {
                handlerClassName = this.annotationMappings[tagName];
            }
        }

        return handlerClassName;
    }

    private getArgumentsForParametersFromWiring(parameters: FormalParameter[], locator: unknown[]): unknown[] {
        const _arguments = [];

        parameters.forEach(parameter => {
            const type = parameter.id.name;
            let typeHint = null;
            //if (type instanceof ReflectionNamedType) {} //FIXME:

            const parameterName = parameter.id.name
            if (typeHint !== null && typeHint in locator) {
                _arguments[parameterName] = locator[typeHint];
                return;
            }

            if (parameterName in locator) {
                _arguments[parameterName] = locator[parameterName];
                return;
            }

            _arguments[parameterName] = null;
        });

        return _arguments;
    }

    private fetchParametersForHandlerFactoryMethod(handler: {new (...args: any[]): {}}|Factory): FormalParameter
}
