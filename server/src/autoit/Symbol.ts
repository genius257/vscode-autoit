import { AutoIt3, LocationRange } from 'autoit3-pegjs';
import DocBlock from './docBlock/DocBlock';
import { URI } from 'vscode-uri';
import Scope, { SymbolKey } from './Scope';

export type Node =
    AutoIt3.Macro | AutoIt3.VariableIdentifier | AutoIt3.Identifier;

export default class Symbol {
    public readonly name: string;

    protected declarations = new Set<Node>();
    protected assignments = new Set<Node>();
    protected references = new Set<Node>();
    protected docblocks = new Map<Node, DocBlock>();

    public constructor(reference: Node | string) {
        this.name = typeof reference === 'string'
            ? reference
            : Symbol.getNodeName(reference);
    }

    public static getNodeName(node: Node): SymbolKey {
        const type = node.type;

        switch (type) {
            case 'Identifier':
                return node.name.toLowerCase() as SymbolKey;
            case 'VariableIdentifier':
                return '$' + node.name.toLowerCase() as SymbolKey;
            case 'Macro':
                return node.value.toLowerCase() as SymbolKey;
            default:
                throw new Error(`Unexpected node type: "${type satisfies never}" when trying to extract name for Symbol`);
        }
    }

    public addDeclaration(node: Node) {
        this.declarations.add(node);
    }

    public getDeclarations(): ReadonlySet<Node> {
        return this.declarations;
    }

    public addAssignment(node: Node) {
        this.assignments.add(node);
    }

    public getAssignments(): ReadonlySet<Node> {
        return this.assignments;
    }

    public addReference(node: Node) {
        this.references.add(node);
    }

    public getReferences(): ReadonlySet<Node> {
        return this.references;
    }

    public addDocblock(node: Node, docblock: DocBlock) {
        this.docblocks.set(node, docblock);
    }

    public getDocblock(node: Node) {
        return this.docblocks.get(node);
    }

    public getDocblocks(): ReadonlyMap<Node, DocBlock> {
        return this.docblocks;
    }

    public addSymbol(symbol: Symbol): void {
        for (const docBlock of symbol.getDocblocks()) {
            this.docblocks.set(docBlock[0], docBlock[1]);
        }

        for (const declaration of symbol.getDeclarations()) {
            this.declarations.add(declaration);
        }

        for (const assignment of symbol.getAssignments()) {
            this.assignments.add(assignment);
        }

        for (const reference of symbol.getReferences()) {
            this.references.add(reference);
        }
    }
}

export type SymbolType = 'variable' | 'function' | 'class' | 'constant';

export class Declaration {
    public readonly name: string;
    public readonly type: SymbolType;
    public readonly uri?: URI;
    public readonly range: LocationRange;
    public readonly scope: Scope;
    public readonly docBlock?: DocBlock;
    protected references = new Set<Symbol>();

    public constructor(arg: {
        name: string,
        type: SymbolType,
        uri?: URI,
        range: LocationRange,
        scope: Scope,
        docBlock?: DocBlock,
    }) {
        this.name = arg.name;
        this.type = arg.type;
        this.uri = arg.uri;
        this.range = arg.range;
        this.scope = arg.scope;
        this.docBlock = arg.docBlock;
    }

    public addReference(symbol: Symbol) {
        this.references.add(symbol);
    }

    public removeReference(symbol: Symbol) {
        this.references.delete(symbol);
    }

    public replaceReference(oldSymbol: Symbol, newSymbol: Symbol) {
        this.references.delete(oldSymbol);
        this.references.add(newSymbol);
    }

    public getReferences(): ReadonlySet<Symbol> {
        return this.references;
    }
}
