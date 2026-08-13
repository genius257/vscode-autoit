import { TagLike } from './Tag';
import Factory from './Tags/Factory/Factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default interface TagFactory extends Factory {
    addParameter(name: string, value: unknown): void,
    addService(service: object): void,
    registerTagHandler(tagName: string, handler: TagLike | Factory): void,
}
