export class Observable<
  State extends unknown = unknown,
  Listener extends (state: State) => void = (state: State) => void
> {
  private listeners = new Set<Listener>();

  constructor(private _state: State) {}

  get state() {
    return this._state;
  }

  /**
   * @param {State} state - The new state to set.
   * @return {void} This function does not return anything.
   */
  set state(state: State) {
    if (state === this._state) return;
    console.log(this.listeners.size);

    this._state = state;
    this.listeners.forEach((listener) => {
      listener(this._state);
    });
  }

  /**
   * @param {Listener} listener - The listener function to be subscribed.
   * @return {() => void} An unsubscribe function that removes the listener from the store.
   */
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
