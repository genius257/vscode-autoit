import Tag, { TagLike } from "./Tag";
import TagFactory from "./TagFactory";
import Author from "./Tags/Author";
import Factory from "./Tags/Factory/Factory";
import FqsenResolver from "../FqsenResolver";
import TypeContext from "../Types/Context";
import InvalidTag from "./Tags/InvalidTag";
import Generic from "./Tags/Generic";
import LinkTag from "./Tags/Link";

// https://github.com/phpDocumentor/ReflectionDocBlock/blob/master/src/DocBlock/StandardTagFactory.php

export default class StandardTagFactory extends TagFactory {
    /** PCRE regular expression matching a tag name. */
    public static readonly REGEX_TAGNAME = '[\\w\\-_\\\\:]+';

    private tagHandlerMappings: Record<string, TagLike|Factory> = {
        'author': Author,
        // 'covers': Covers,
        // 'deprecated': Deprecated,
        // 'example': Example,
        'link': LinkTag,
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

    private fqsenResolver: FqsenResolver; //FIXME

    /**
     * An array representing a simple Service Locator where we can store parameters and services that can be inserted into the Factory Methods of Tag Handlers.
     */
    private serviceLocator: unknown[] = [];

    public constructor(fqsenResolver: FqsenResolver, tagHandlers: Record<string, TagLike>|null = null) {
        super();

        this.fqsenResolver = fqsenResolver;
        if (tagHandlers !== null) {
            this.tagHandlerMappings = tagHandlers;
        }

        this.addService(fqsenResolver, FqsenResolver.name);
    }

    public create(tagLine: string, context: TypeContext|null = null): Tag {
        if (context === null) {
            context = new TypeContext('');
        }

        const [tagName, tagBody] = this.extractTagParts(tagLine);

        return this.createTag(tagBody!.trim(), tagName!, context);
    }

    public addParameter(name: string, value: unknown): void {
        this.serviceLocator[name] = value;
    }

    public addService(service: any, alias: string|null = null): void {
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
        const matches = tagLine.match(new RegExp(`^@(${StandardTagFactory.REGEX_TAGNAME})((?:[\\s\\(\\{])\\s*([^\\s].*)|$)`, 'us'));

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

        try {
            const tag = handlerClassName === Generic ? (handlerClassName as typeof Generic).create(body, name) : handlerClassName.create(body);

            return tag ?? InvalidTag.create(body, name);
        } catch (e) {
            return InvalidTag.create(body, name).withError(e);
        }
    }

    private findHandlerClassName(tagName: string, context: TypeContext): TagLike|Factory {
        let handlerClassName: TagLike|Factory = Generic;
        if (tagName in this.tagHandlerMappings) {
            handlerClassName = this.tagHandlerMappings[tagName]!;
        } else if (this.isAnnotation(tagName)) {
            // TODO: Annotation support is planned for a later stage and as such is disabled for now
            tagName = this.fqsenResolver.resolve(tagName, context).toString();
            if (tagName in this.annotationMappings) {
                handlerClassName = this.annotationMappings[tagName]!;
            }
        }

        return handlerClassName;
    }

    private isAnnotation(tegContext: string): boolean {
        // 1. Contains a namespace separator
        // 2. Contains parenthesis
        // 3. Is present in a list of known annotations (make the algorithm smart by first checking is the last part
        //    of the annotation class name matches the found tag name

        return false;
    }
}
