import type Description from "../Description";
import type Formatter from "./Formatter";
import PassthroughFormatter from "./Formatter/PassthroughFormatter";
import Tag from "../Tag";

export default abstract class BaseTag extends Tag {
    /** String Name of the tag */
    protected name: string = '';

    protected description: Description|null = null;

    public getName(): string {
        return this.name;
    }

    public getDescription(): Description|null {
        return this.description;
    }

    public render(formatter: Formatter|null = null): string {
        if (formatter === null) {
            formatter = new PassthroughFormatter();
        }

        return formatter.format(this);
    }
}
