"use client";
import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "system" | "dark";

const THEME_KEY = "theme";
const VALID_THEMES: Theme[] = ["light", "system", "dark"];

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "system";
  try {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    return saved && VALID_THEMES.includes(saved) ? saved : "system";
  } catch {
    return "system";
  }
};

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: Theme, systemTheme: "light" | "dark") => {
  const actualTheme = theme === "system" ? systemTheme : theme;
  document.documentElement.setAttribute("data-theme", actualTheme);
  document.documentElement.style.colorScheme = actualTheme;
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getInitialTheme());
    setSystemTheme(getSystemTheme());
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemTheme(getSystemTheme());
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      applyTheme(theme, systemTheme);
    }
  }, [theme, systemTheme]);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch {
      // Silently fail if localStorage is not available
    }
  }, []);

  const themes = [
    {
      value: "light" as const,
      label: "Light mode",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
        </svg>
      ),
    },
    {
      value: "system" as const,
      label: "System mode",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="13" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      value: "dark" as const,
      label: "Dark mode",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      ),
    },
  ];

  const currentIndex = themes.findIndex((t) => t.value === theme);

  return (
    <div className="relative inline-flex items-center rounded-full p-1 shadow-sm border bg-surface border-border">
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 w-8 rounded-full transition-transform duration-200 ease-out shadow-sm bg-brand-500"
        style={{ transform: `translateX(${currentIndex * 32}px)` }}
      />

      {/* Theme buttons */}
      {themes.map((themeOption) => (
        <button
          key={themeOption.value}
          type="button"
          onClick={() => handleThemeChange(themeOption.value)}
          aria-label={themeOption.label}
          title={themeOption.label}
          className={`relative z-10 inline-flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-200 ${
            theme === themeOption.value
              ? "text-white"
              : "text-fg hover:text-brand-500"
          }`}
        >
          {themeOption.icon}
        </button>
      ))}
    </div>
  );
}
