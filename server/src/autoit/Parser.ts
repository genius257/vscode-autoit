import { LocationRange } from "autoit3-pegjs";
import { Range } from "vscode-languageserver";

export default class Parser {
    /** Converts a autoit3-pegjs Location to a vscode Range */
    public static locationToRange(location: LocationRange): Range {
        return {
            start: {
                character: location.start.column - 1,
                line: location.start.line - 1,
            },
            end: {
                character: location.end.column - 1,
                line: location.end.line - 1,
            }
        }
    }
}
