import { URI } from 'vscode-languageserver';

export default class DependencyGraph {
    protected adjacencyList = new Map<URI, Set<URI>>();
    protected rev = new Map<URI, Set<URI>>();

    public setDependencies(source: URI, targets: URI[]) {
        const oldTargets = this.adjacencyList.get(source);
        const newTargets = new Set(targets);

        if (oldTargets === undefined) {
            this.adjacencyList.set(source, newTargets);

            return;
        }

        for (const oldTarget of oldTargets) {
            if (!newTargets.has(oldTarget)) {
                // Remove old reverse edges
                this.rev.get(oldTarget)?.delete(source);
            }
        }

        this.adjacencyList.set(source, newTargets);

        // Add new reverse edges
        for (const newTarget of newTargets) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const map = this.rev.get(newTarget) ?? this.rev.set(newTarget, new Set()).get(newTarget)!;

            map.add(source);
        }
    }

    public addDependency(source: URI, target: URI): void {
        if (!this.adjacencyList.has(source)) {
            this.adjacencyList.set(source, new Set());
        }

        this.adjacencyList.get(source)?.add(target);
    }

    public removeDependency(source: URI, target: URI): void {
        const dependencies = this.adjacencyList.get(source);

        if (dependencies === undefined) {
            return;
        }

        dependencies.delete(target);
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
