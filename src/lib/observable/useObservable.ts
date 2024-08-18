import { useEffect, useState } from "react";
import { Observable } from "./Observable";

/**
 * @template T - The type of the state stored in the store.
 * @param {Observable<T>} store - The store to subscribe to.
 * @param {() => Store<T> | Partial<Store<T>> | T[keyof T]} [selector] - An optional selector function that returns a portion of the store's state.
 * @return {T} - The selected state from the store.
 */
export function useObservable<T>(
  store: Observable<T>,
  selector?: () => T | Partial<T> //| T[keyof T]
) {
  const [state, setState] = useState(selector?.() || store.state);

  useEffect(
    () => store.subscribe(() => setState(selector?.() || store.state)),
    [store, selector]
  );

  return state;
}

/** example
const initialState: { id: string; name: string } = { id: "1", name: "sdfasdf" };

class ExtendedUserStore extends Observable<typeof initialState> {
  constructor() {
    super(initialState);
  }
  changeName(name: string) {
    this.state.name = name;
  }
  getName() {
    return this.state.name;
  }
}

export const userStore = new Observable(initialState);
export const extendedUserStore = new ExtendedUserStore();

export const useUser = () => useObservable(userStore);
export const useUserName = () => useObservable(extendedUserStore, extendedUserStore.getName);
 */
