import Context from "./Types/Context";
import Fqsen from "./Fqsen";

export default class FqsenResolver {
    private static readonly OPERATOR_NAMESPACE = '\\';

    public resolve(fqsen: string, context: Context|null = null): Fqsen {
        if (context === null) {
            context = new Context('');
        }

        if (this.isFqsen(fqsen)) {
            return new Fqsen(fqsen);
        }

        return this.resolvePartialStructuralElementName(fqsen, context);
    }

    private isFqsen(type: string): boolean {
        return type.indexOf(FqsenResolver.OPERATOR_NAMESPACE) === 0;
    }

    private resolvePartialStructuralElementName(type: string, context: Context): Fqsen {
        const typeParts = type.split(FqsenResolver.OPERATOR_NAMESPACE, 2);

        const namespaceAliases = context.getNamespaceAliases;

        if (!(typeParts[0] in namespaceAliases)) {
            let namespace = context.getNamespace();
            if (namespace !== '') {
                namespace += FqsenResolver.OPERATOR_NAMESPACE;
            }

            return new Fqsen(`${FqsenResolver.OPERATOR_NAMESPACE}${namespace}${type}`);
        }

        typeParts[0] = namespaceAliases[typeParts[0]];

        return new Fqsen(`${FqsenResolver.OPERATOR_NAMESPACE}${typeParts.join(FqsenResolver.OPERATOR_NAMESPACE)}`);
    }
}