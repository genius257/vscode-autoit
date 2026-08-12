import { derive } from '@traits-ts/core';
import NodeAttributes from '../NodeAttributes';
import ConstExprNode from './ConstExprNode';

export default class ConstFetchNode extends derive(NodeAttributes) implements ConstExprNode {
    /** class name for class constants or empty string for non-class constants */
    public className: string;
    public name: string;

    public constructor(className: string, name: string) {
        super();

        this.className = className;
        this.name = name;
    }

    public override toString(): string {
        if (this.className === '') {
            return this.name;
        }

        return `${this.className}::${this.name}`;
    }
}
