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
    if (isAbsolutePath(path.valueOf().toString())) {
        return typeof path === 'string' ? URI.file(path) : path;
    }

    path = typeof path === 'string' ? URI.file(path) : path;

    return Utils.resolvePath(path, ...paths);
}
