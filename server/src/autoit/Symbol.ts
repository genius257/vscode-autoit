import { AutoIt3, LocationRange } from 'autoit3-pegjs';
import DocBlock from './docBlock/DocBlock';
import { URI } from 'vscode-uri';
import Scope from './Scope';

type Node =
    AutoIt3.Macro | AutoIt3.VariableIdentifier | AutoIt3.Identifier;

export default class Symbol {
    public readonly name: string;
    protected node: Node;

    public constructor(node: Node) {
        this.node = node;
        this.name = 'name' in node ? node.name : node.value;
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

export class Reference {}
