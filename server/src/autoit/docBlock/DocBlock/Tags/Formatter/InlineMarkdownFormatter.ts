import BaseTag from '../BaseTag';
import Link from '../Link';
import MarkdownFormatter from './MarkdownFormatter';

export default class InlineMarkdownFormatter extends MarkdownFormatter {
    public override format(tag: BaseTag): string {
        let body = tag.toString();

        switch (true) {
            case tag instanceof Link:
            {
                const description = tag.getDescription()?.render(this) ?? '';

                if (description === '') {
                    body = `<${tag.getLink()}>`;
                } else {
                    body = `[${description}](${tag.getLink()})`;
                }

                break;
            }
        }

        return body;
    }
}
