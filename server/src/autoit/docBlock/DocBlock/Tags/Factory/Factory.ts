import Context from '../../../Types/Context';
import Tag from '../../Tag';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default interface Factory {
    create(tagLine: string, context?: Context | null): Tag,
}
