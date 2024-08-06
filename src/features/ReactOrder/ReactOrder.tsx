import {
  PropsWithChildren,
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
} from "react";
import code from "./assets/code.png";

function First({ children }: PropsWithChildren) {
  console.log(1);
  useEffect(() => console.log(2), []);
  return (
    <>
      <p>
        Guess the numbers order from code printed in console. <br />{" "}
        <code>Inter the order of numbers and then open the console.</code>
      </p>
      {children}
    </>
  );
}

function Second() {
  console.log(3);
  useEffect(() => console.log(4), []);
  useLayoutEffect(() => console.log(5), []);
  return <input ref={() => console.log(6)} />;
}

function Third() {
  console.log(7);
  useEffect(() => console.log(8), []);
  useLayoutEffect(() => console.log(9), []);
  return <img src={code} />;
}

export function ReactOrder() {
  useInsertionEffect(() => console.log(10), []);
  return (
    <>
      <h1>React Order</h1>
      <main ref={() => console.log(11)}>
        <First>
          <Second />
        </First>
        <br />
        <br />
        <Third />
      </main>
    </>
  );
}
