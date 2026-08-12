import Type from './Type';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default interface PseudoType extends Type {
    underlyingType(): Type,
}
