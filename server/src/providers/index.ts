import BaseProvider from './BaseProvider';
import { CompletionItemProvider } from './CompletionItemProvider';
import { DefinitionProvider } from './DefinitionProvider';
import { DocumentSymbolProvider } from './DocumentSymbolProvider';
import { ReferencesProvider } from './ReferencesProvider';
import { SignatureHelpProvider } from './SignatureHelpProvider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export default [
    CompletionItemProvider,
    DefinitionProvider,
    DocumentSymbolProvider,
    ReferencesProvider,
    SignatureHelpProvider,
] as const satisfies Constructor<BaseProvider>[];
