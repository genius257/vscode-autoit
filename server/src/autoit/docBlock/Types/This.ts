import Type from '../Type';

export default class This implements Type {
    public toString(): string {
        return '$this';
    }
}
