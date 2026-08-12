import AbstractList from './AbstractList';
import Mixed_ from './Mixed_';

export default class Iterable_ extends AbstractList {
    public override toString(): string {
        if (this.keyType) {
            return 'iterable<' + this.keyType.toString() + ',' + this.valueType.toString() + '>';
        }

        if (this.valueType instanceof Mixed_) {
            return 'iterable';
        }

        return 'iterable<' + this.valueType.toString() + '>';
    }
}
