import BaseProvider from './BaseProvider';
import { CompletionItemProvider } from './CompletionItemProvider';
import { SignatureHelpBridge } from './SignatureHelpBridge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export default [
    CompletionItemProvider,
    SignatureHelpBridge,
] as const satisfies Constructor<BaseProvider>[];
