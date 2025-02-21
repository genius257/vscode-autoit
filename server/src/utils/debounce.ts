// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function debounce<F extends Function>(cb: F, delay = 250) {
    let timeout;

    return (((...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        }, delay);
    }) as unknown) as F;
}
