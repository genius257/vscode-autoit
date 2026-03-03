export type EventMap = Record<string | symbol, unknown>;

export type Listener<T> = (payload: T) => void;

export default class EventEmitter<Events extends EventMap> {
    protected listeners: {
        [K in keyof Events]?: Set<Listener<Events[K]>>;
    } = {};

    on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }

        this.listeners[event].add(listener);
    }

    off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
        this.listeners[event]?.delete(listener);

        // Optional cleanup to avoid empty sets accumulating
        if (this.listeners[event]?.size === 0) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.listeners[event];
        }
    }

    emit<K extends keyof Events>(event: K, payload: Events[K]): void {
        this.listeners[event]?.forEach((listener) => {
            listener(payload);
        });
    }

    once<K extends keyof Events>(
        event: K,
        listener: Listener<Events[K]>,
    ): void {
        const wrapper: Listener<Events[K]> = (payload) => {
            this.off(event, wrapper);
            listener(payload);
        };

        this.on(event, wrapper);
    }

    clear<K extends keyof Events>(event?: K): void {
        if (event) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.listeners[event];
        } else {
            this.listeners = {};
        }
    }
}
