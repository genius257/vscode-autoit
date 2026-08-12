import Attribute from './Attribute';

export type NodeAttributeMap = {
    [Attribute.START_LINE]: number,
    [Attribute.END_LINE]: number,
    [Attribute.START_INDEX]: number,
    [Attribute.END_INDEX]: number,
    [Attribute.ORIGINAL_NODE]: unknown, // unused; could be `Node` if desired
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default interface Node {
    toString(): string,
    setAttribute<K extends keyof NodeAttributeMap>(key: K, value: NodeAttributeMap[K]): void,
    hasAttribute(key: keyof NodeAttributeMap): boolean,
    getAttribute<K extends keyof NodeAttributeMap>(key: K): NodeAttributeMap[K] | null,
}
