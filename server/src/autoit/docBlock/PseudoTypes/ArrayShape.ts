import PseudoType from '../PseudoType';
import Type from '../Type';
import Array_ from '../Types/Array_';
import ArrayKey from '../Types/ArrayKey';
import Mixed_ from '../Types/Mixed_';
import ArrayShapeItem from './ArrayShapeItem';

export default class ArrayShape implements PseudoType {
    private items: ArrayShapeItem[];

    public constructor(...items: ArrayShapeItem[]) {
        this.items = items;
    }

    public getItems(): ArrayShapeItem[] {
        return [...this.items];
    }

    public underlyingType(): Type {
        return new Array_(new Mixed_(), new ArrayKey());
    }

    public toString(): string {
        return 'array{' + this.items.join(', ') + '}';
    }
}
