"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState("#3672EA");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Initialize from localStorage and listen for system preference changes
  useEffect(() => {
    // Load saved preferences
    const savedColor = localStorage.getItem("primary-color");
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode | null;

    if (savedColor) {
      setPrimaryColor(savedColor);
    }

    if (savedMode) {
      setThemeModeState(savedMode);
      applyTheme(savedMode);
    } else {
      applyTheme("light");
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (themeMode === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Re-apply theme when mode changes
  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    let effectiveTheme: "light" | "dark";

    if (mode === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      effectiveTheme = mode;
    }

    setResolvedTheme(effectiveTheme);

    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem("theme-mode", mode);
    applyTheme(mode);
  };

  const setPrimaryColor = (hex: string) => {
    setPrimaryColorState(hex);
    localStorage.setItem("primary-color", hex);

    // Convert hex to HSL and update CSS variable
    const hsl = hexToHSL(hex);
    if (hsl) {
      document.documentElement.style.setProperty("--primary", hsl);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        themeMode,
        setThemeMode,
        resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Helper function
function hexToHSL(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return `${hDeg} ${sPct}% ${lPct}%`;
}
