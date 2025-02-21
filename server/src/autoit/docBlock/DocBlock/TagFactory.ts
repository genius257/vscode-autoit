import { TagLike } from './Tag';
import Factory from './Tags/Factory/Factory';

export default abstract class TagFactory extends Factory {
    public abstract addParameter(name: string, value: unknown): void;

    public abstract addService(service: object): void;

    public abstract registerTagHandler(
        tagName: string,
        handler: TagLike | Factory
    );
}
