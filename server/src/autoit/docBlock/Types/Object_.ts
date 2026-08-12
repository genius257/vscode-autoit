import { strpos } from 'locutus/php/strings';
import Fqsen from '../Fqsen';
import Type from '../Type';
import { InvalidArgumentException } from '../TypeResolver';

export default class Object_ implements Type {
    private fqsen: Fqsen | null;

    public constructor(fqsen: Fqsen | null) {
        if (strpos(fqsen?.toString() ?? '', '::', 0) !== false || strpos(fqsen?.toString() ?? '', '()', 0) !== false) {
            throw new InvalidArgumentException(
                'Object types can only refer to a class, interface or trait but a method, function, constant or ' + 'property was received: ' + (fqsen?.toString() ?? ''),
            );
        }

        this.fqsen = fqsen;
    }

    public getFqsen(): Fqsen | null {
        return this.fqsen;
    }

    public toString(): string {
        if (this.fqsen) {
            return this.fqsen.toString();
        }

        return 'object';
    }
}
