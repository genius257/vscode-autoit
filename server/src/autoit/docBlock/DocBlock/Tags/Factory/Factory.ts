import type BaseTag from "../BaseTag";

type TypeContext = unknown;
export default abstract class Factory {
    public abstract create(tagLine: string, context?: TypeContext): BaseTag;
}
