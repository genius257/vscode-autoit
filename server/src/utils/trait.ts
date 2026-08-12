// Use 'abstract new' to allow both abstract and regular classes
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
export type GConstructor<T = {}> = abstract new (...args: any[]) => T;

// Non-abstract constructor type, for use in `new` expressions (e.g. casting `this.constructor`)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Converts a standard class into a Trait (mixin function).
 */
export function asTrait<TTrait extends GConstructor>(TraitClass: TTrait) {
    return <TBase extends GConstructor>(Base: TBase) => {
    // We use a class expression to merge the types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Combined = class extends (Base as any) {
            // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
            constructor(...args: unknown[]) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                super(...args);

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
                const traitInstance = new (TraitClass as any)();
                Object.assign(this, traitInstance);
            }
        };

        // Type casting here is necessary to merge the two class signatures
        return Combined as unknown as TBase & TTrait;
    };
}

/**
 * Composes a base class with multiple traits (mixins).
 *
 * This function applies a series of class transformations (traits) to a base class
 * in the order they are provided. It replicates PHP-style trait composition while
 * maintaining full TypeScript type safety and instance property initialization.
 *
 * @template TBase - The type of the constructor for the base class.
 *
 * @param {Array<(b: any) => any>} traits - An array of trait functions (usually
 * created via `asTrait`) to be applied to the base class.
 * @param {TBase} [Base] - The base class to be extended. Defaults to an empty
 * anonymous class if not provided.
 *
 * @returns {TBase} A new class constructor that incorporates all methods and
 * properties from the provided traits and the base class.
 *
 * @example
 * class User extends mix([asTrait(Loggable), asTrait(Timestampable)], BaseUser) {
 *   // User now has methods from Loggable and Timestampable
 * }
 */
export function mix<TBase extends GConstructor>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    traits: ((b: any) => any)[],
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class, @stylistic/curly-newline
    Base: TBase = class {} as unknown as TBase,
): TBase {
    /*
     * We cast the reduction to 'any' internally to bypass the
     * complex intersection math, then back to TBase for the consumer.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    return traits.reduce((acc, trait) => trait(acc), Base) as any;
}
