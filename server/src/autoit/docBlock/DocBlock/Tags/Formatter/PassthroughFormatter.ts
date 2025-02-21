import BaseTag from '../BaseTag';
import type Formatter from '../Formatter';

export default class PassthroughFormatter implements Formatter {
    /**
     * Formats the given tag to return a simple plain text version.
     */
    public format(tag: BaseTag): string {
        return `@${tag.getName()} ${tag}`.trim();
    }
}
