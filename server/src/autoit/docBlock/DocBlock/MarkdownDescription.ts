import vsprintf from 'locutus/php/strings/vsprintf';
import Description from './Description';
import Formatter from './Tags/Formatter';
import InlineMarkdownFormatter from './Tags/Formatter/InlineMarkdownFormatter';

export default class MarkdownDescription extends Description {
    public override render(formatter: Formatter | null = null): string {
        if (this.getTags().length === 0) {
            return vsprintf(this.getBodyTemplate(), []);
        }

        if (formatter === null) {
            formatter = new InlineMarkdownFormatter();
        }

        const tags = this.getTags().map((tag) => formatter.format(tag));

        return vsprintf(this.getBodyTemplate(), tags);
    }
}
