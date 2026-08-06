export default class Fqsen {
    /** full quallified class name */
    private fqsen: string;

    /** name of the element without path. */
    private name: string;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-unused-vars
    public constructor(fqsen: string) {
        const regex = /^\\([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff\\]*)?(?:::\$?([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*))?(?:\(\))?$/;

        const matches = fqsen.match(regex);

        if (!matches) {
            throw new Error(`"${fqsen}" is not a valid Fqsen.`);
        }

        this.fqsen = fqsen;

        if (matches[2] !== undefined) {
            this.name = matches[2];
        } else if (fqsen === '\\') {
            this.name = '';
        } else {
            const parts = fqsen.split('\\');
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const lastName = parts[parts.length - 1]!;
            this.name = lastName.replace(/\(\)$/, '');
        }
    }

    public toString(): string {
        return this.fqsen;
    }

    public getName(): string {
        return this.name;
    }
}
