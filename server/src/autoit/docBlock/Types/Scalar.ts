import Type from '../Type';

export default class Scalar implements Type {
    public toString(): string {
        return 'scalar';
    }
}
