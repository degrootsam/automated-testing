import { useState, useEffect } from "react";

export type ThemeType = "light" | "dark" | string;

/**
 * Custom hook that manages the DaisyUI theme.
 *
 * @param initialTheme Optional initial theme; if omitted, defaults to
 *                     "dark" if the user prefers dark mode, else "light".
 * @returns An array with the current theme and a function to update the theme.
 */
export default function useTheme(
  initialTheme?: ThemeType,
): [ThemeType, (theme: ThemeType) => void] {
  // Determine the initial theme. If initialTheme is not provided,
  // we use the user's system preference.
  const getInitialTheme = (): ThemeType => {
    if (initialTheme) return initialTheme;
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  const [theme, setThemeState] = useState<ThemeType>(getInitialTheme());

  /**
   * Sets the DaisyUI theme by updating the state and the <html> element's data-theme attribute.
   *
   * @param newTheme The new theme to set (for example, "light", "dark", "cupcake", etc.)
   */
  const setTheme = (newTheme: ThemeType): void => {
    setThemeState(newTheme);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme);
      console.log(`Theme set to ${newTheme}`);
    }
  };

  // Ensure that the document has the correct theme on mount and when the theme changes.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return [theme, setTheme];
}
