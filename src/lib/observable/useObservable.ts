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

class ExtendedTaskStore extends Observable<typeof initialState> {
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

export const taskStore = new Observable(initialState);
export const extendedTaskStore = new ExtendedTaskStore();

export const useProject = () => useObservable(taskStore);
export const useProjectName = () => useObservable(extendedTaskStore, extendedTaskStore.getName);
 */