import { describe, expect, test } from 'vitest';
import buildSignatureLabel, {
    SIGNATURE_PARAMS_THRESHOLD,
    SIGNATURE_PARAMS_VISIBLE,
} from './signatureParams';

describe('buildSignatureLabel', () => {
    test('does not truncate short signatures', () => {
        const { label, parameterRanges } = buildSignatureLabel('Abs', ['$expression']);

        expect(label).toBe('Abs($expression)');
        expect(parameterRanges).toHaveLength(1);
        expect(parameterRanges[0]).toEqual([4, 15]);
    });

    test('renders all parameters joined by comma-space without truncation', () => {
        const parameters = [
            '$a', '$b = 2', '$c = @DesktopWidth / 2',
        ];
        const { label, parameterRanges } = buildSignatureLabel('test', parameters);

        expect(label).toBe('test($a, $b = 2, $c = @DesktopWidth / 2)');
        expect(parameterRanges).toHaveLength(3);
        expect(parameterRanges.map(([start, end]) => label.slice(start, end))).toEqual(parameters);
    });

    test('does not truncate exactly at the threshold', () => {
        const parameters = Array.from({ length: SIGNATURE_PARAMS_THRESHOLD }, (_, index) => `$value${index + 1}`);
        const { label, parameterRanges } = buildSignatureLabel('test', parameters);

        expect(label).toBe('test(' + parameters.join(', ') + ')');
        expect(parameterRanges).toHaveLength(SIGNATURE_PARAMS_THRESHOLD);
        expect(parameterRanges.map(([start, end]) => label.slice(start, end))).toEqual(parameters);
    });

    test('truncates middle parameters above the threshold', () => {
        const parameters = Array.from({ length: SIGNATURE_PARAMS_THRESHOLD + 1 }, (_, index) => `$value${index + 1}`);
        const { label, parameterRanges } = buildSignatureLabel('test', parameters);

        const head = parameters.slice(0, SIGNATURE_PARAMS_VISIBLE);
        const tail = parameters.slice(-SIGNATURE_PARAMS_VISIBLE);
        const visibleParameterCount = SIGNATURE_PARAMS_VISIBLE * 2;
        const expectedHidden = parameters.length - visibleParameterCount;

        expect(label).toBe(`test(${head.join(', ')}, ..., ${tail.join(', ')})`);
        expect(parameterRanges).toHaveLength(parameters.length);

        const headRanges = parameterRanges.slice(0, SIGNATURE_PARAMS_VISIBLE);
        const hiddenRanges = parameterRanges.slice(SIGNATURE_PARAMS_VISIBLE, SIGNATURE_PARAMS_VISIBLE + expectedHidden);
        const tailRanges = parameterRanges.slice(-SIGNATURE_PARAMS_VISIBLE);

        expect(headRanges.map(([start, end]) => label.slice(start, end))).toEqual(head);
        expect(new Set(hiddenRanges.map((range) => label.slice(range[0], range[1])))).toEqual(new Set(['...']));
        expect(tailRanges.map(([start, end]) => label.slice(start, end))).toEqual(tail);
    });

    test('truncates the native 255 parameter emulations', () => {
        const parameters = Array.from({ length: 255 }, (_, index) => `$value${index + 1}${index > 1 ? ' = Default' : ''}`);
        const { label, parameterRanges } = buildSignatureLabel('BitAND', parameters);

        expect(label).toBe(
            'BitAND($value1, $value2, $value3 = Default, $value4 = Default, ..., ' +
            '$value252 = Default, $value253 = Default, $value254 = Default, $value255 = Default)',
        );
        expect(parameterRanges).toHaveLength(255);
        expect(label).not.toContain('$value125,');
        expect(label).toContain('...');
    });

    test('keeps parameter strings containing commas and parentheses intact', () => {
        const parameters = ['$flag', '$x = @DesktopWidth / 2'];
        const { label, parameterRanges } = buildSignatureLabel('ControlClick', parameters);

        expect(label).toBe('ControlClick($flag, $x = @DesktopWidth / 2)');
        expect(parameterRanges.map(([start, end]) => label.slice(start, end))).toEqual(parameters);
    });
});
