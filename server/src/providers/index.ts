import BaseProvider from './BaseProvider';
import { CompletionItemProvider } from './CompletionItemProvider';
import { SignatureHelpProvider } from './SignatureHelpProvider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export default [
    CompletionItemProvider,
    SignatureHelpProvider,
] as const satisfies Constructor<BaseProvider>[];
