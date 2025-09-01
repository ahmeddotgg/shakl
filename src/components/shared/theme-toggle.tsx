import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="icon"
      variant="ghost"
    >
      <Moon className="absolute size-5 rotate-0 dark:rotate-90 scale-100 dark:scale-0 !transition-all" />
      <Sun className="size-5 rotate-90 dark:-rotate-0 scale-0 dark:scale-100 !transition-all" />
    </Button>
  );
}
