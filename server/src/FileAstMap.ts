import { URI, Utils } from 'vscode-uri';

export type Maps<DataType> = {
    [uri: string]: {
        data: DataType,
        counter: number,
        includes: string[],
    }
}

export default class FileAstMap<DataType extends {body?: Array<any>}, Parser extends Function> {
    protected maps: Maps<DataType> = {};
    protected parser: Parser;

    constructor(parser: Parser) {
        this.parser = parser;
    }

    exists(uri): boolean {
        return this.maps.hasOwnProperty(uri);
    }

    add(uri: string, data: DataType): void {
        if (this.exists(uri)) {
            this.maps[uri].counter += 1;
            // update the data
            this.maps[uri].data = data;
        } else {
            this.maps[uri] = {
                data: data,
                counter: 1,
                includes: [],
            };
        }

        this.maps[uri].data = data;
        //this.addIncludes(uri);
    }

    addIncludes(uri) {
        const previousIncludes = this.maps[uri].includes;
        const includes = this.maps[uri].data?.body?.filter((node: {type: string}) => node.type === "IncludeStatement").map(includeUri => this.resolveIncludePath(uri, includeUri)) ?? [];

        this.difference(previousIncludes, includes).forEach(previousInclude => this.release(previousInclude));
        this.difference(includes, previousIncludes).forEach(include => {
            this.addInclude(include);
        });

        this.maps[uri].includes = includes;
    }

    addInclude(uri) {
        if (this.exists(uri)) {
            this.maps[uri].counter++;
            return;
        }

        //FIXME: use vs file api to read files.
        //this.add(uri, this.parser(fs ))
    }

    resolveIncludePath(textDocumentUri: string, includeStatementUri: string): string {
        //FIXME: currently we only resolve the include uri's as "Script directory" includes. Implementation need for "User-defined libraries" and "Standard library".
        // An extra parameter indicating starting from script or standard library when looking for the file is needed.
        // This may hovever not be needed in the webworker version?
        return Utils.resolvePath(Utils.dirname(URI.parse(textDocumentUri)), includeStatementUri).toString();
    }

    difference(arr1: any[], arr2: any[]): any[] {
        return arr1.filter(x => !arr2.includes(x));
    }

    release(uri: string): void {
        if (this.exists(uri)) {
            if (--this.maps[uri].counter <= 0) {
                delete this.maps[uri];
            }
        }
    }

    get(uri: string): DataType {
        if (!this.exists(uri)) {
            throw new Error(`URI not found in map: ${uri}`);
        }
        return this.maps[uri].data;
    }
}
