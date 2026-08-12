import type { Connection } from 'vscode-languageserver';

export type DeprecationBackend = 'none' | 'console' | 'connection';

/**
 * Manages deprecation logging in different ways.
 *
 * By default deprecations are not surfaced (mirrors Doctrine's default of
 * TYPE_NONE). Opt into a backend with enableWithConsole() or
 * enableWithConnection().
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- Port of Doctrine\Deprecations\Deprecation, which is a static-only class.
export default class Deprecation {
    private static backend: DeprecationBackend = 'none';

    private static connection: Connection | null = null;

    private static deduplication = true;

    private static ignoredLinks = new Set<string>();

    private static ignoredPackages = new Set<string>();

    private static triggeredDeprecations = new Map<string, number>();

    private constructor() {
        // static-only
    }

    /**
     * Trigger a deprecation for the given package and link.
     *
     * The link points to a GitHub issue or wiki entry detailing the
     * deprecation; it is also used to de-duplicate repeated triggers.
     */
    public static trigger(packageName: string, link: string, message: string, ...args: (string | number)[]): void {
        if (Deprecation.backend === 'none') {
            return;
        }

        if (Deprecation.ignoredPackages.has(packageName)) {
            return;
        }

        if (Deprecation.ignoredLinks.has(link)) {
            return;
        }

        const count = (Deprecation.triggeredDeprecations.get(link) ?? 0) + 1;
        Deprecation.triggeredDeprecations.set(link, count);

        if (Deprecation.deduplication && count > 1) {
            return;
        }

        const formatted = args.length > 0 ? formatMessage(message, args) : message;

        if (Deprecation.backend === 'console') {
            // eslint-disable-next-line no-console
            console.warn(`${formatted} (${link})`);

            return;
        }

        if (Deprecation.connection !== null) {
            Deprecation.connection.window.showWarningMessage(`${formatted} (${link})`);
        }
    }

    public static enableWithConsole(): void {
        Deprecation.backend = 'console';
    }

    public static enableWithConnection(connection: Connection): void {
        Deprecation.backend = 'connection';
        Deprecation.connection = connection;
    }

    public static withoutDeduplication(): void {
        Deprecation.deduplication = false;
    }

    public static ignorePackage(packageName: string): void {
        Deprecation.ignoredPackages.add(packageName);
    }

    public static ignoreDeprecations(...links: string[]): void {
        for (const link of links) {
            Deprecation.ignoredLinks.add(link);
        }
    }

    public static getUniqueTriggeredDeprecationsCount(): number {
        let count = 0;

        for (const occurrences of Deprecation.triggeredDeprecations.values()) {
            count += occurrences;
        }

        return count;
    }

    public static getTriggeredDeprecations(): Record<string, number> {
        return Object.fromEntries(Deprecation.triggeredDeprecations);
    }

    public static reset(): void {
        Deprecation.backend = 'none';
        Deprecation.connection = null;
        Deprecation.deduplication = true;
        Deprecation.ignoredLinks.clear();
        Deprecation.ignoredPackages.clear();
        Deprecation.triggeredDeprecations.clear();
    }
}

/** Minimal sprintf-like substitution for %s / %d placeholders. */
function formatMessage(message: string, args: (string | number)[]): string {
    let argIndex = 0;

    return message.replace(/%[sd]/g, () => {
        const arg = args[argIndex++];

        return arg === undefined ? '' : String(arg);
    });
}
