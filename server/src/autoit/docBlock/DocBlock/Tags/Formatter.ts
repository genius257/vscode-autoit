import Tag from "../Tag";

export default interface Formatter {
    format(tag: Tag): string
}
