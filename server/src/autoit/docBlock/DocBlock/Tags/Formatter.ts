import type BaseTag from "./BaseTag";

export default interface Formatter {
    format(tag: BaseTag): string
}
