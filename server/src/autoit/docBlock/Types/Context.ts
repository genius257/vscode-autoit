export default class Context {
    private namespace: string;

    private namespaceAliases: Record<string, string>;

    public constructor(
        namespace: string,
        namespaceAliases: Record<string, string> = {},
    ) {
        this.namespace = namespace !== 'global' && namespace !== 'default' ? namespace.replace(/(^\\+|\\+$)/, '') : '';

        Object.entries(namespaceAliases).forEach(([
            alias,
            fqnn,
        ]) => {
            if (fqnn[0] === '\\') {
                fqnn = fqnn.substring(1);
            }

            if (fqnn[fqnn.length - 1] === '\\') {
                fqnn = fqnn.substring(0, -1);
            }

            namespaceAliases[alias] = fqnn;
        });

        this.namespaceAliases = namespaceAliases;
    }

    public getNamespace(): string {
        return this.namespace;
    }

    public getNamespaceAliases(): Record<string, string> {
        return this.namespaceAliases;
    }
}
