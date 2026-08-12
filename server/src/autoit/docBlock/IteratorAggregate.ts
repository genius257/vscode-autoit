// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default interface IteratorAggregate<T = unknown> {
    getIterator(): IterableIterator<T>,
}
