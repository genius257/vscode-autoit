export default function assertCannotReach(x: never, message: string = 'Unexpected unreachable code reached.'): never {
    throw new Error(message);
}
