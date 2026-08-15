/**
 * Checks whether a value implements an interface at runtime.
 *
 * Because TypeScript interfaces are erased at compile time, a webpack
 * transformer injects a static `__implements__: string[]` array onto class
 * constructors that declare an `implements` clause. This helper walks the
 * prototype/constructor chain and reports whether any recorded interface name
 * matches the given one.
 *
 * @param target The value to test; may be a class/constructor (e.g. a `TagLike`)
 *   or an instance (e.g. a `Factory`).
 * @param interfaceName The (unqualified) name of the interface, matching what
 *   the transformer recorded via `symbol.getName()`.
 * @returns Whether the value (or any of its ancestors) implements the interface.
 */
type InterfaceTester = object & {
    __implements__?: string[],
};

export default function instanceofInterface(
    target: object,
    interfaceName: string,
): boolean {
    let ctor: InterfaceTester | null = typeof target === 'function'
        ? target as InterfaceTester
        : (target as InterfaceTester & { constructor?: InterfaceTester }).constructor ?? null;

    while (ctor !== null) {
        if (ctor.__implements__?.includes(interfaceName)) {
            return true;
        }

        ctor = Object.getPrototypeOf(ctor) as InterfaceTester | null;
    }

    return false;
}
