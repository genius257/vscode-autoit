import { trait } from '@traits-ts/core';
import { NodeAttributeMap } from './Node';
import TypeNode from './Type/TypeNode';

export default trait((base) => class NodeAttributes extends base implements TypeNode {
    private attributes: Partial<NodeAttributeMap> = {};

    public setAttribute<K extends keyof NodeAttributeMap>(key: K, value: NodeAttributeMap[K]): void {
        this.attributes[key] = value;
    }

    public hasAttribute<K extends keyof NodeAttributeMap>(
        key: K,
    ): this is this & { getAttribute(k: K): NodeAttributeMap[K] } {
        return Object.prototype.hasOwnProperty.call(this.attributes, key);
    }

    public getAttribute<K extends keyof NodeAttributeMap>(key: K): NodeAttributeMap[K] | null {
        return this.attributes[key] ?? null;
    }
});
