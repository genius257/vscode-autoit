import { TokenOffset, TokenType } from '../Lexer/Lexer';

export class ParserException extends Error {
    public constructor(
        public currentTokenValue: string,
        public currentTokenType: number,
        public currentTokenOffset: number,
        public expectedTokenType: number,
        public expectedTokenValue: string | null,
        public currentTokenLine: number,
    ) {
        super(`Unexpected token "${currentTokenValue}"`);

        // restore prototype chain
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto);
    }

    public getMessage(): string {
        return this.message;
    }
}

export class LogicException extends Error {
    protected code: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public constructor(message: string = '', code: number = 0, _previous: Error | null = null) {
        super(message);

        this.code = code;

        // restore prototype chain
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto);
    }
}

export default class TokenIterator {
    /** @var [string, number, number][] */
    private tokens: [string, TokenType, number][];

    private index: number;

    private savePoints: number[] = [];

    private skippedTokenTypes: TokenType[] = [TokenType.TOKEN_HORIZONTAL_WS];

    private newline: string | null = null;

    public constructor(tokens: [string, TokenType, number][], index: number = 0) {
        this.tokens = tokens;
        this.index = index;
        this.skipIrrelevantTokens();
    }

    public getTokens(): [string, TokenType, number][] {
        return this.tokens;
    }

    public getContentBetween(startPos: number, endPos: number): string {
        if (startPos < 0 || endPos > this.tokens.length) {
            throw new LogicException();
        }

        let content = '';

        for (let i = startPos; i < endPos; i++) {
            content += this.tokens[i]?.[TokenOffset.VALUE_OFFSET] ?? '';
        }

        return content;
    }

    public getTokenCount(): number {
        return this.tokens.length;
    }

    public currentTokenValue(): string {
        return this.getToken()[TokenOffset.VALUE_OFFSET];
    }

    public currentTokenType(): TokenType {
        return this.getToken()[TokenOffset.TYPE_OFFSET];
    }

    public currentTokenOffset(): number {
        let offset = 0;

        for (let i = 0; i < this.index; i++) {
            offset += this.tokens[i]?.[TokenOffset.VALUE_OFFSET].length ?? 0;
        }

        return offset;
    }

    public currentTokenLine(): number {
        return this.getToken()[TokenOffset.LINE_OFFSET];
    }

    public currentTokenIndex(): number {
        return this.index;
    }

    public endIndexOfLastRelevantToken(): number {
        let endIndex = this.currentTokenIndex();
        endIndex--;

        while (this.skippedTokenTypes.includes(this.getToken(endIndex)[TokenOffset.TYPE_OFFSET])) {
            if (this.tokens[endIndex - 1] === undefined) {
                break;
            }

            endIndex--;
        }

        return endIndex;
    }

    public isCurrentTokenValue(tokenValue: string): boolean {
        return this.getToken()[TokenOffset.VALUE_OFFSET] === tokenValue;
    }

    public isCurrentTokenType(...tokenTypes: TokenType[]): boolean {
        return tokenTypes.includes(this.getToken()[TokenOffset.TYPE_OFFSET]);
    }

    public isPrecededByHorizontalWhitespace(): boolean {
        return (
            (this.tokens[this.index - 1]?.[TokenOffset.TYPE_OFFSET] ?? -1) ===
            TokenType.TOKEN_HORIZONTAL_WS
        );
    }

    public consumeTokenType(tokenType: TokenType): void {
        if (this.getToken()[TokenOffset.TYPE_OFFSET] !== tokenType) {
            this.throwError(tokenType);
        }

        if (tokenType === TokenType.TOKEN_PHPDOC_EOL && this.newline === null) {
            this.detectNewline();
        }

        this.index++;
        this.skipIrrelevantTokens();
    }

    public consumeTokenValue(tokenType: TokenType, tokenValue: string): void {
        if (
            this.getToken()[TokenOffset.TYPE_OFFSET] !== tokenType ||
            this.getToken()[TokenOffset.VALUE_OFFSET] !== tokenValue
        ) {
            this.throwError(tokenType, tokenValue);
        }

        this.index++;
        this.skipIrrelevantTokens();
    }

    public tryConsumeTokenValue(tokenValue: string): boolean {
        if (this.getToken()[TokenOffset.VALUE_OFFSET] !== tokenValue) {
            return false;
        }

        this.index++;
        this.skipIrrelevantTokens();

        return true;
    }

    public tryConsumeTokenType(tokenType: TokenType): boolean {
        if (this.getToken()[TokenOffset.TYPE_OFFSET] !== tokenType) {
            return false;
        }

        if (tokenType === TokenType.TOKEN_PHPDOC_EOL && this.newline === null) {
            this.detectNewline();
        }

        this.index++;
        this.skipIrrelevantTokens();

        return true;
    }

    public getSkippedHorizontalWhiteSpaceIfAny(): string {
        if (
            this.index > 0 &&
            this.tokens[this.index - 1]?.[TokenOffset.TYPE_OFFSET] === TokenType.TOKEN_HORIZONTAL_WS
        ) {
            return this.getToken(this.index - 1)[TokenOffset.VALUE_OFFSET];
        }

        return '';
    }

    public joinUntil(...tokenTypes: TokenType[]): string {
        let s = '';

        while (!tokenTypes.includes(this.getToken()[TokenOffset.TYPE_OFFSET])) {
            s += this.getToken(this.index++)[TokenOffset.VALUE_OFFSET];
        }

        return s;
    }

    public next(): void {
        this.index++;
        this.skipIrrelevantTokens();
    }

    public addEndOfLineToSkippedTokens(): void {
        this.skippedTokenTypes = [TokenType.TOKEN_HORIZONTAL_WS, TokenType.TOKEN_PHPDOC_EOL];
    }

    public removeEndOfLineFromSkippedTokens(): void {
        this.skippedTokenTypes = [TokenType.TOKEN_HORIZONTAL_WS];
    }

    public forwardToTheEnd(): void {
        this.index = this.tokens.length - 1;
    }

    public pushSavePoint(): void {
        this.savePoints.push(this.index);
    }

    public dropSavePoint(): void {
        this.savePoints.pop();
    }

    public rollback(): void {
        const index = this.savePoints.pop();

        if (index === undefined) {
            throw new Error('No savepoint to rollback to');
        }

        this.index = index;
    }

    public hasTokenImmediatelyBefore(pos: number, expectedTokenType: TokenType): boolean {
        pos--;

        for (; pos >= 0; pos--) {
            const type = this.getToken(pos)[TokenOffset.TYPE_OFFSET];

            if (type === expectedTokenType) return true;

            if (![TokenType.TOKEN_HORIZONTAL_WS, TokenType.TOKEN_PHPDOC_EOL].includes(type)) {
                break;
            }
        }

        return false;
    }

    public hasTokenImmediatelyAfter(pos: number, expectedTokenType: TokenType): boolean {
        pos++;

        for (let c = this.tokens.length; pos < c; pos++) {
            const type = this.getToken(pos)[TokenOffset.TYPE_OFFSET];

            if (type === expectedTokenType) return true;

            if (![TokenType.TOKEN_HORIZONTAL_WS, TokenType.TOKEN_PHPDOC_EOL].includes(type)) {
                break;
            }
        }

        return false;
    }

    public getDetectedNewline(): string | null {
        return this.newline;
    }

    public hasParentheses(startPos: number, endPos: number): boolean {
        return (
            this.hasTokenImmediatelyBefore(startPos, TokenType.TOKEN_OPEN_PARENTHESES) &&
            this.hasTokenImmediatelyAfter(endPos, TokenType.TOKEN_CLOSE_PARENTHESES)
        );
    }

    private detectNewline(): void {
        const value = this.currentTokenValue();

        if (value.startsWith('\r\n')) {
            this.newline = '\r\n';
        } else if (value.startsWith('\n')) {
            this.newline = '\n';
        }
    }

    private skipIrrelevantTokens(): void {
        if (this.tokens[this.index] === undefined) {
            return;
        }

        while (this.skippedTokenTypes.includes(this.getToken()[TokenOffset.TYPE_OFFSET])) {
            if (this.tokens[this.index + 1] === undefined) {
                break;
            }

            this.index++;
        }
    }

    private throwError(expectedTokenType: number, expectedTokenValue: string | null = null): void {
        throw new ParserException(
            this.currentTokenValue(),
            this.currentTokenType(),
            this.currentTokenOffset(),
            expectedTokenType,
            expectedTokenValue,
            this.currentTokenLine(),
        );
    }

    private getToken(index: number = this.index): [string, TokenType, number] {
        const token = this.tokens[index];

        if (token === undefined) {
            throw new Error(`Token at index ${index} is undefined`);
        }

        return token;
    }
}
