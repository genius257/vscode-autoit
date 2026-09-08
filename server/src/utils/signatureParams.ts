/**
 * Builds function signature labels with truncation of the middle parameters.
 *
 * Some native functions are emulated with a large number of parameters (e.g.
 * BitAND, Call and DllCall use up to 255 parameters). Rendering every
 * parameter would make function signatures unreadable and dominate hover text,
 * completion suggestion details and signature help, so the middle parameters
 * are collapsed into an ellipsis placeholder.
 *
 * Alongside the label, this returns the label offsets of each original
 * parameter (hidden parameters map to the ellipsis placeholder), which can be
 * used directly as `ParameterInformation.label` ranges in signature help.
 */

/**
 * The maximum number of parameters rendered in full before truncation kicks in.
 * Must be greater than `SIGNATURE_PARAMS_VISIBLE * 2` so the head and tail
 * parameters never overlap.
 */
export const SIGNATURE_PARAMS_THRESHOLD = 12;

/** The number of leading and trailing parameters kept when truncating. */
export const SIGNATURE_PARAMS_VISIBLE = 4;

export type SignatureParameterLabelRange = [
    start: number,
    end: number,
];

export type SignatureLabelParts = {
    label: string,

    /**
     * The label offsets of each original parameter, by parameter index.
     * Hidden (truncated) parameters share the offsets of the ellipsis
     * placeholder, so signature help highlights it for them.
     */
    parameterRanges: SignatureParameterLabelRange[],
};

export default function buildSignatureLabel(
    functionName: string,
    parameterStrings: string[],
): SignatureLabelParts {
    if (parameterStrings.length <= SIGNATURE_PARAMS_THRESHOLD) {
        let label = functionName + '(';
        const parameterRanges: SignatureParameterLabelRange[] = [];

        parameterStrings.forEach((parameter, index) => {
            if (index > 0) {
                label += ', ';
            }

            parameterRanges.push([
                label.length,
                label.length + parameter.length,
            ]);

            label += parameter;
        });

        label += ')';

        return {
            label,
            parameterRanges,
        };
    }

    const head = parameterStrings.slice(0, SIGNATURE_PARAMS_VISIBLE);
    const tail = parameterStrings.slice(-SIGNATURE_PARAMS_VISIBLE);
    const visibleParameterCount = SIGNATURE_PARAMS_VISIBLE * 2;
    const hiddenCount = parameterStrings.length - visibleParameterCount;
    const ellipsis = '...';

    let label = functionName + '(';
    const parameterRanges: SignatureParameterLabelRange[] = [];

    head.forEach((parameter) => {
        parameterRanges.push([
            label.length,
            label.length + parameter.length,
        ]);

        label += parameter + ', ';
    });

    const ellipsisStart = label.length;
    label += ellipsis;

    const ellipsisRange: SignatureParameterLabelRange = [
        ellipsisStart,
        label.length,
    ];

    for (let index = 0; index < hiddenCount; index++) {
        parameterRanges.push(ellipsisRange);
    }

    label += ', ';

    tail.forEach((parameter) => {
        parameterRanges.push([
            label.length,
            label.length + parameter.length,
        ]);

        label += parameter + ', ';
    });

    label = label.slice(0, -2) + ')';

    return {
        label,
        parameterRanges,
    };
}
