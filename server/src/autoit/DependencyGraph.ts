import { URI } from 'vscode-languageserver';

export default class DependencyGraph {
    protected adjacencyList = new Map<URI, Set<URI>>();

    public addDependency(parent: URI, child: URI): void {
        if (this.adjacencyList.has(parent)) {
            this.adjacencyList.set(parent, new Set());
        }

        this.adjacencyList.get(parent)?.add(child);
    }

    public removeDependency(parent: URI, child: URI): void {
        const dependencies = this.adjacencyList.get(parent);

        if (dependencies === undefined) {
            return;
        }

        dependencies.delete(child);
    }

    public removeScript(id: URI): void {
        this.adjacencyList.delete(id);

        // Remove references to this script from other nodes
        for (const dependencies of this.adjacencyList.values()) {
            dependencies.delete(id);
        }
    }

    public resolveDependencies(rootId: URI, visited = new Set<URI>()) {
        const dependencies = this.adjacencyList.get(rootId);

        if (dependencies === undefined) {
            return Array.from(visited);
        }

        for (const dependency of dependencies) {
            if (visited.has(dependency)) {
                continue;
            }

            visited.add(dependency);
            this.resolveDependencies(dependency, visited);
        }

        return Array.from(visited);
    }
}
