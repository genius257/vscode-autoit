import { URI, Utils } from 'vscode-uri';

export function isAbsolutePath(path: string): boolean {
    return /^(\/|[a-zA-Z]:(\\|\/)|\\\\\?\\|\\)/.test(path);
}

export function isRelativePath(path: string): boolean {
    return !isAbsolutePath(path);
}

export function normalizePath(path: string): string {
    return path.replace(/\\/g, '/');
}

export function removeTrailingSlash(path: string): string {
    return path.replace(/\/$/, '');
}

export function removeLeadingSlash(path: string): string {
    return path.replace(/^\//, '');
}

// function to resolve a relative path to an absolute path, or return the original path if it is already absolute
export function resolvePath(path: string | URI, ...paths: string[]): URI {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (isAbsolutePath(path.valueOf().toString())) {
        return typeof path === 'string' ? URI.file(path) : path;
    }

    path = typeof path === 'string' ? URI.file(path) : path;

    return Utils.resolvePath(path, ...paths);
}

/**
 * Computes a posix-style relative path from a directory path to a target path.
 * Both inputs are absolute paths using forward slashes (e.g. URI.path values).
 * Returns a path relative to `fromDir`, using `..` segments when the target is
 * not contained in `fromDir`.
 */
export function relativePath(fromDir: string, toPath: string): string {
    const fromSegments = removeTrailingSlash(fromDir).split('/')
        .filter((segment) => segment !== '');
    const toSegments = toPath.split('/')
        .filter((segment) => segment !== '');

    let common = 0;

    while (
        common < fromSegments.length &&
        common < toSegments.length &&
        fromSegments[common]?.toLowerCase() === toSegments[common]?.toLowerCase()
    ) {
        common++;
    }

    const up = fromSegments.slice(common).map(() => '..');
    const down = toSegments.slice(common);

    const relative = [...up, ...down].join('/');

    return relative === '' ? '.' : relative;
}
