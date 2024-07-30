export function debounce(fn: Function, delay = 100) {
  let timer = 0;
  return function (...args: unknown[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
