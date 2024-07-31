import { useEffect, useRef, MouseEvent } from "react";

const DARK = "dark";
const LIGHT = "light";

export function useDarkMode(target = document.documentElement) {
  const switcher = useRef<HTMLInputElement | null>();

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) target.setAttribute("data-theme", theme);
    if (theme === DARK) switcher.current?.setAttribute("checked", "true");

    function handler(e: Event) {
      const theme = (e as unknown as MouseEvent<HTMLInputElement>).currentTarget
        .checked
        ? DARK
        : LIGHT;
      target.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }

    switcher.current?.addEventListener("change", handler);
    return () => switcher.current?.removeEventListener("change", handler);
  }, []);

  return switcher;
}
