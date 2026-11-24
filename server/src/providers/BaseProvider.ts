import { Connection, Disposable } from 'vscode-languageserver';
import { Workspace } from '../autoit/Workspace';

export default abstract class BaseProvider {
    protected workspace: Workspace;

    public constructor(workspace: Workspace) {
        this.workspace = workspace;
    }

    public abstract register(connection: Connection): Disposable;
}
