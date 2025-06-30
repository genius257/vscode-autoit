import { DiagnosticSeverity, Position, SignatureHelp, SignatureHelpParams } from 'vscode-languageserver';
import { Workspace } from '../autoit/Workspace';
import { LocationRange, SyntaxError, type AutoIt3 } from 'autoit3-pegjs';
import * as PositionHelper from '../autoit/PositionHelper';
import * as Parser from '../autoit/Parser';
import Script from '../autoit/Script';

type WhereAstTypeEquals<T extends { type: string }, S extends string> =
    T extends { type: S } ? T : never;

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

type CallExpressionNode = WhereAstTypeEquals<AutoIt3.CallExpression, 'CallExpression'>;

export class SignatureHelpBridge {
    protected workpspace: Workspace;
    protected declarator: AutoIt3.FunctionDeclaration | null = null;
    protected callExpression: CallExpressionNode | null = null;

    public constructor(workpspace: Workspace) {
        this.workpspace = workpspace;
    }

    resolveSignatureHelp(
        params: SignatureHelpParams,
    ): SignatureHelp | null {
        const textDocumentUri = params.textDocument.uri;
        const position = params.position;

        const script = this.workpspace.get(textDocumentUri);

        if (script === undefined) {
            // todo: log error in workspace console
            return null;
        }

        const hasSyntaxErrors = script.getDiagnostics().some((diagnostic) => diagnostic.severity === DiagnosticSeverity.Error && diagnostic.message.includes('Syntax error'));

        let callExpression: CallExpressionNode | undefined;
        let declarator: AutoIt3.FunctionDeclaration | null | ReturnType<typeof script.getIdentifierDeclarator>;

        if (params.context?.isRetrigger && this.callExpression !== null && this.declarator !== null && hasSyntaxErrors) {
            callExpression = this.callExpression;
            declarator = this.declarator;
        } else {
            const nodesAt = script.getNodesAt(position);

            if (nodesAt === undefined) {
                return null;
            }

            callExpression = nodesAt.reverse().find((node): node is WhereAstTypeEquals<AutoIt3.CallExpression, 'CallExpression'> => node.type === 'CallExpression' && PositionHelper.isPositonWithinLocationRange(position, node.location));

            if (callExpression === undefined) {
                return null;
            }

            if (callExpression.callee.type !== 'Identifier') {
                return null;
            }

            this.callExpression = callExpression;

            declarator = script.getIdentifierDeclarator(callExpression.callee);

            if (declarator === null || declarator.type === 'VariableDeclarator' || declarator.type === 'Parameter') { // FIXME: currently we don't look for identifier in the VariableDeclarator init!
                return null;
            }

            this.declarator = declarator;
        }

        const callExpressionHelper = new CallExpressionHelper(callExpression, script);

        // If there is a syntax error, we try to patch and re-parse the relevant text
        if (hasSyntaxErrors) {
            try {
                callExpressionHelper.tryAndFixMissingArguments();
            } catch (error) {
                if (error instanceof UnfixableCallExpressionError) {
                    // Failed to fix expression, we cannot give signature help, and will return early.
                    return null;
                }

                throw error;
            }
        }

        if (callExpressionHelper.isPositionWithinCallExpression(position) === false) {
            return null;
        }

        callExpression = callExpressionHelper.shadowExpression ?? callExpression;

        if (callExpression.callee.type !== 'Identifier') {
            return null;
        }

        const activeParameterIndex = callExpressionHelper.getParameterIndexFromPosition(position);

        return {
            activeSignature: 0,
            activeParameter: activeParameterIndex,
            signatures: [
                {
                    label: declarator.id.name + '(' + Parser.AstArrayToStringArray(declarator.params).join(', ') + ')',
                    documentation: callExpression.callee.name,
                    parameters: declarator.params.map((parameter) => ({
                        label: '$' + parameter.id.name,
                        documentation: undefined,
                    })),
                },
            ],
        };
    }
}

class CallExpressionHelper {
    public expression: CallExpressionNode;
    public shadowExpression: CallExpressionNode | null = null;
    public shadowExpressionText: string | null = null;
    public shadowExpressionOffset: number = 0;

    // Array to hold shadow values for missing arguments
    public shadowValues: LocationRange[] = [];
    public script: Script;
    public text: string;

    public constructor(callExpression: CallExpressionNode, script: Script) {
        this.expression = callExpression;
        this.script = script;
        this.text = script.getText();
    }

    public validateCallExpression(callExpressionText: string): SyntaxError | boolean {
        try {
            const ast = Parser.parse(callExpressionText, this.expression.location.source.toString());

            const statement = ast.body[0];

            if (statement === undefined) {
                return false;
            }

            if (statement.type !== 'ExpressionStatement') {
                return false;
            }

            const expression = statement.expression;

            if (expression.type !== 'CallExpression') {
                return false;
            }

            this.shadowExpression = expression;

            return true;
        } catch (error) {
            if (!Parser.isSyntaxError(error)) {
                throw error;
            }

            return error;
        }
    }

    // method to fix the call expression by inserting shadow values
    public tryAndFixMissingArguments() {
        const lines = this.text.split('\n');

        let callExpressionText = lines.slice(this.expression.location.start.line - 1, this.expression.location.end.line).join('\n');

        const attempts = 255; // Limit attempts to prevent infinite loops

        for (let i = 0; i < attempts; i++) {
            const validation = this.validateCallExpression(callExpressionText);

            if (validation === true) {
                this.shadowExpressionText = callExpressionText;
                this.shadowExpressionOffset = lines.slice(0, this.expression.location.start.line - 1).join('\n').length + (this.expression.location.start.line > 1 ? 1 : 0); // +1 to account for the newline character

                return;
            }

            if (validation === false) {
                throw new UnfixableCallExpressionError('Invalid call expression: ' + this.expression.location.source.toString());
            }

            switch (validation.found) {
                case ')':
                case ',':
                    // We expect this is a missing value in the call expression. We will add shadow values and re-parse
                    callExpressionText = callExpressionText.slice(0, validation.location.start.offset) + '1' + callExpressionText.slice(validation.location.start.offset);
                    this.shadowValues.push({
                        start: {
                            line: validation.location.start.line,
                            column: validation.location.start.column,
                            offset: validation.location.start.offset,
                        },
                        end: {
                            line: validation.location.start.line,
                            column: validation.location.start.column + 1,
                            offset: validation.location.start.offset + 1,
                        },
                        source: this.expression.location.source,
                    });

                    break;
                default:
                    // The call expression might be within another thing, so we try to cut the text and re-parse 🙏
                    callExpressionText = callExpressionText.slice(0, validation.location.start.offset);
            }
        }

        throw new UnfixableCallExpressionError('Failed to fix call expression after ' + attempts + ' attempts: ' + this.expression.location.source.toString());
    }

    public getParameterLocations(): LocationRange[] {
        const callExpression = this.shadowExpression ?? this.expression;
        const text = this.shadowExpressionText ?? this.text;

        const callArguments: LocationRange[] = [];

        const start = callExpression.callee.location.start;
        const end = callExpression.location.end;

        for (let index = 0; index < callExpression.arguments.length; index++) {
            const previousEndLocation = callExpression.arguments[index - 1]?.location.end ?? start;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const currentCallArgument = callExpression.arguments[index]!;
            const nextCallArgument = callExpression.arguments[index + 1]?.location.start ?? end;

            const before = text.slice(previousEndLocation.offset, currentCallArgument.location.start.offset);
            const after = text.slice(currentCallArgument.location.end.offset, nextCallArgument.offset);

            let beforeDividerIndex = before.indexOf(',');

            if (beforeDividerIndex === -1) {
                beforeDividerIndex = before.indexOf('(');

                if (beforeDividerIndex === -1) {
                    throw new Error('Unreachable');
                }
            }

            beforeDividerIndex += 1;

            let afterDividerIndex = after.indexOf(',');

            if (afterDividerIndex === -1) {
                afterDividerIndex = after.indexOf(')');

                if (afterDividerIndex === -1) {
                    throw new Error('Unreachable');
                }
            }

            afterDividerIndex -= 1;

            const location = structuredClone(currentCallArgument.location) as Writeable<LocationRange>;

            // function to re-calculate column, if lastIndexOf newline is -1
            const calculateColumn = (text: string, column: number): number => {
                const lastNewLineIndex = text.lastIndexOf('\n');

                return lastNewLineIndex === -1 ? column : text.length - lastNewLineIndex;
            };

            const startLocationText = text.slice(previousEndLocation.offset, previousEndLocation.offset + beforeDividerIndex); // This is just to ensure the text is sliced correctly
            const endLocationText = text.slice(currentCallArgument.location.end.offset, nextCallArgument.offset + afterDividerIndex); // This is just to ensure the text is sliced correctly

            location.start = {
                line: previousEndLocation.line,
                column: calculateColumn(startLocationText, previousEndLocation.column + beforeDividerIndex),
                offset: this.shadowExpressionOffset + previousEndLocation.offset + beforeDividerIndex,
            };

            location.end = {
                line: nextCallArgument.line,
                column: calculateColumn(endLocationText, nextCallArgument.column + afterDividerIndex),
                offset: this.shadowExpressionOffset + nextCallArgument.offset + afterDividerIndex,
            };

            callArguments.push(location);
        }

        return callArguments;
    }

    public getParameterIndexFromPosition(position: Position): number {
        const callArguments = this.getParameterLocations();

        if (callArguments.length === 0) {
            // find the locationrange between start and end parentheses
            const start = this.expression.callee.location.start;
            const end = this.expression.location.end;

            // locationrange start is based on index of "(" follwing start
            const startOffset = this.text.indexOf('(', start.offset) + 1; // +2 to move past the "("

            // locationrange end is based on index of ")" before end
            const endOffset = this.text.lastIndexOf(')', end.offset); // +1 to include the ")"

            const locationRange: LocationRange = {
                start: PositionHelper.offsetToLocation(startOffset, this.text),
                end: PositionHelper.offsetToLocation(endOffset, this.text),
                source: this.expression.location.source,
            };

            return PositionHelper.isPositonWithinLocationRange(position, locationRange) ? 0 : -1; // If position is within the parentheses, return 0, otherwise -1
        }

        // Cursor offset in the text
        const offset = PositionHelper.positionToOffset(position, this.text);

        /**
         * offset shift to account for shadow values
         * This is used to adjust the offset when shadow values are present
         */
        let offsetShift = 0;

        for (const callArgument of callArguments) {
            let shiftedOffset = offset + offsetShift;

            const isShadowValue = this.shadowValues.some((shadowValue) => shadowValue.start.offset + this.shadowExpressionOffset === callArgument.start.offset && shadowValue.end.offset + this.shadowExpressionOffset === callArgument.end.offset);

            if (isShadowValue && shiftedOffset >= callArgument.start.offset) {
                const diff = callArgument.end.offset - callArgument.start.offset;
                offsetShift += diff; // Adjust the offset shift for shadow values
                shiftedOffset += diff; // Adjust the shifted offset for shadow values
            }

            if (shiftedOffset >= callArgument.start.offset && shiftedOffset <= callArgument.end.offset) {
                // If the offset is before the start of the call argument, we can return the index
                return callArguments.indexOf(callArgument);
            }
        }

        return -1; // Not found
    }

    public isPositionWithinCallExpression(position: Position): boolean {
        if (this.shadowExpression === null) {
            return PositionHelper.isPositonWithinLocationRange(position, this.expression.location);
        }

        const offset = PositionHelper.positionToOffset(position, this.script.getText());

        const shadowValuesOffset = this.shadowValues.reduce((acc, shadowValue) => {
            return acc + (shadowValue.end.offset - shadowValue.start.offset);
        }, 0);

        return this.shadowExpression.location.start.offset + this.shadowExpressionOffset <= offset &&
            this.shadowExpression.location.end.offset + this.shadowExpressionOffset - shadowValuesOffset >= offset;
    }
}

export class UnfixableCallExpressionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnfixableCallExpressionError';
    }
}
