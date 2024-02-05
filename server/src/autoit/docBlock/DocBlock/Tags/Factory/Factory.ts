import Tag from "../../Tag";

type TypeContext = unknown;
export default abstract class Factory {
    public abstract create(tagLine: string, context?: TypeContext): Tag;
}
