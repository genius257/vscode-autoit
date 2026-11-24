import { Connection, Disposable, DocumentLink, DocumentLinkParams, Range } from 'vscode-languageserver';
import BaseProvider from './BaseProvider';
import { AutoIt3 } from 'autoit3-pegjs';
import { URI } from 'vscode-uri';

export class DocumentLinkProvider extends BaseProvider {
    public override register(connection: Connection): Disposable {
        return connection.onDocumentLinks(this.getDocumentLinks.bind(this));
    }

    public getDocumentLinks(params: DocumentLinkParams): Thenable<DocumentLink[]> | DocumentLink[] | null | undefined {
        const includes = this.workspace.get(params.textDocument.uri)?.getIncludes();

        if (includes === undefined) {
            return [];
        }

        const statementToRange = (
            statement: AutoIt3.IncludeStatement,
        ): Range => ({
            start: {
                line: statement.location.start.line - 1,
                character: Math.max(
                    0,
                    statement.location.end.column - statement.file.length - 3,
                ),
            },
            end: {
                line: statement.location.end.line - 1,
                character: statement.location.end.column - 1,
            },
        });

        return Promise
            .all(includes.map((include) => include.promise))
            .then<DocumentLink[]>(() => includes.filter((include) => !(include.uri ?? '').startsWith('autoit3doc:') && include.uri !== null).map<DocumentLink>((include) => ({
                range: statementToRange(include.statement),
                target: include.uri ?? undefined,
                tooltip: include.uri === null
                    ? undefined
                    : URI.parse(include.uri).fsPath,
            })));
    }
}
