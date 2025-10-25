"use client";

import { Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "@/src/hooks/use-theme";
import styles from "./theme-toggle.module.css";

export function ThemeToggle() {
  // TEMPORARILY DISABLED: Theme toggle hidden while only dark mode is active
  return null;

  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const themeOrder: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = themeOrder.indexOf(theme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];

    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className={styles.icon} />;
      case "dark":
        return <Moon className={styles.icon} />;
      case "system":
        return <Settings className={styles.icon} />;
      default:
        return <Sun className={styles.icon} />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light mode";
      case "dark":
        return "Dark mode";
      case "system":
        return "System preference";
      default:
        return "Light mode";
    }
  };

  const getNextThemeLabel = () => {
    switch (theme) {
      case "light":
        return "dark";
      case "dark":
        return "system";
      case "system":
        return "light";
      default:
        return "dark";
    }
  };

  return (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={toggleTheme}
      aria-label={`Switch to ${getNextThemeLabel()} mode`}
      title={getThemeLabel()}
    >
      {getThemeIcon()}
    </button>
  );
}
