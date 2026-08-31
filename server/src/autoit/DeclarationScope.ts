import { type LocationRange } from 'autoit3-pegjs';
import * as PositionHelper from './PositionHelper';
import type Scope from './Scope';
import type Script from './Script';

export type ScopeLabel = 'local' | 'global';

/**
 * Walks the scope tree of the given script to find the innermost scope whose
 * range contains the declaration location.
 */
function findEnclosingScope(scope: Scope, location: LocationRange): Scope {
    for (const subscope of scope.getSubscopes()) {
        if (subscope.range !== undefined && PositionHelper.isLocationWithinLocationRange(location.start, subscope.range)) {
            return findEnclosingScope(subscope, location);
        }
    }

    return scope;
}

/**
 * Determines whether a declaration resides in global scope or within a
 * function (local) scope, based on the scope tree of the script containing it.
 *
 * Returns undefined when the scope cannot be determined.
 */
export function getScopeLabel(
    declarationScript: Script,
    declaration: { location: LocationRange },
): ScopeLabel | undefined {
    try {
        const scope = findEnclosingScope(declarationScript.getScope(), declaration.location);

        return scope.isGlobal() ? 'global' : 'local';
    } catch {
        return undefined;
    }
}
