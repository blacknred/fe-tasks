import { Observable } from "./Observable";
import { describe, it, expect, vi } from "vitest";

describe("Observable", () => {
  it("should initialize with the provided state", () => {
    const initialState = { foo: "bar" };
    const observable = new Observable(initialState);
    expect(observable.state).toEqual(initialState);
  });

  it("should notify listeners when the state changes", () => {
    const initialState = { foo: "bar" };
    const observable = new Observable(initialState);
    const listener = vi.fn();
    observable.subscribe(listener);

    const newState = { foo: "baz" };
    observable.state = newState;

    expect(listener).toHaveBeenCalledWith(newState);
  });

  it("should allow listeners to be unsubscribed", () => {
    const initialState = { foo: "bar" };
    const observable = new Observable(initialState);
    const listener = vi.fn();
    const unsubscribe = observable.subscribe(listener);

    observable.state = { foo: "baz" };
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    observable.state = { foo: "qux" };
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should not notify listeners if the state does not change", () => {
    const initialState = { foo: "bar" };
    const observable = new Observable(initialState);
    const listener = vi.fn();
    observable.subscribe(listener);

    observable.state = initialState;
    expect(listener).not.toHaveBeenCalled();
  });

  it("should allow multiple listeners to be subscribed", () => {
    const initialState = { foo: "bar" };
    const observable = new Observable(initialState);
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    observable.subscribe(listener1);
    observable.subscribe(listener2);

    const newState = { foo: "baz" };
    observable.state = newState;

    expect(listener1).toHaveBeenCalledWith(newState);
    expect(listener2).toHaveBeenCalledWith(newState);
  });

  it("should allow listeners to be subscribed after the state has changed", () => {
    const initialState = { foo: "bar" };
    const observable = new Observable(initialState);
    const newState = { foo: "baz" };
    observable.state = newState;

    const listener = vi.fn();
    observable.subscribe(listener);

    expect(listener).not.toHaveBeenCalled();
  });

  it("should throw an error if the listener is not a function", () => {
    const initialState = { foo: "bar" };
    const observable = new Observable(initialState);

    // @ts-expect-error
    expect(() => observable.subscribe("not a function")).toThrowError(
      "Listener must be a function"
    );
  });
});
