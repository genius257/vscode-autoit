import Context from '../Types/Context';
import DescriptionFactory from './DescriptionFactory';
import MarkdownDescription from './MarkdownDescription';
import Tag from './Tag';

export default class MarkdownDescriptionFactory extends DescriptionFactory {
    public override create(
        contents: string,
        context: Context | null = null,
    ): MarkdownDescription {
        const description = super.create(contents, context);

        return new MarkdownDescription(
            description.getBodyTemplate(),
            description.getTags() as Tag[],
        );
    }
}
