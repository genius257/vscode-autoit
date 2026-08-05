declare const __opaque__type__: unique symbol;

export type OpaqueType<BaseType, TagName> = BaseType & {
    readonly [__opaque__type__]: TagName,
};
