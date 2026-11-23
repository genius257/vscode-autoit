import BaseProvider from './BaseProvider';
import { CompletionItemBridge } from './CompletionItemBridge';
import { SignatureHelpBridge } from './SignatureHelpBridge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export default [
    CompletionItemBridge,
    SignatureHelpBridge,
] as const satisfies Constructor<BaseProvider>[];
