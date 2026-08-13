import Tag from '../../Tag';

type TypeContext = unknown;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default interface Factory {
    create(tagLine: string, context?: TypeContext): Tag,
}
