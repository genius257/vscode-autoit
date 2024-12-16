export default function debounce<F extends Function>(cb: F, delay = 250) {
    let timeout;

    return <F>(<any>((...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        }, delay);
    }));
}
