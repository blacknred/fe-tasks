import Observable, { useObservable } from "../../lib/observable";

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
export const useProjectName = () =>
  useObservable(extendedTaskStore, extendedTaskStore.getName);
