export function countFps() {
  let fps = 0;
  const start = Date.now();

  (function f() {
    fps++;
    if (Date.now() - start > 1000) console.log(fps);
    else requestAnimationFrame(f);
  })();
}
