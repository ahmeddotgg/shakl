import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="icon"
      variant="ghost"
    >
      <Moon className="absolute size-5 rotate-0 scale-100 transition-all! dark:rotate-90 dark:scale-0" />
      <Sun className="size-5 rotate-90 scale-0 transition-all! dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
