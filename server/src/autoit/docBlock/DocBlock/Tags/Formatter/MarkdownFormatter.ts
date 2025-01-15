import BaseTag from "../BaseTag";
import Formatter from "../Formatter";
import Link from "../Link";

export default class MarkdownFormatter implements Formatter {
    public format(tag: BaseTag): string {
        let body = tag.toString();
        switch (true) {
            case tag instanceof Link:
                const description = tag.getDescription()?.render(this) ?? "";

                if (description === "") {
                    body = `<${tag.getLink()}>`;
                } else {
                    body = `[${description}](${tag.getLink()})`;
                }
                break;
        }

        return `*@${tag.getName()}*${body !== "" ? ` — ${body}` : ""}`;
    }
}
