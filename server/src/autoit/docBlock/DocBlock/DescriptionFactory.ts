import Description from "./Description";

type TypeContext = unknown;//FIXME

export default class DescriptionFactory {
    //private tagFactory: TagFactory;
    
    //public constructor(tagFactory: TagFactory)

    public create(contents: string, context: TypeContext|null = null): Description {
        //FIXME

        return new Description(contents);
    }
}
