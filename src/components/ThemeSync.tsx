import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { useAppSelector } from "@/redux/hooks";
import { useThemeMode } from "@/redux/feature/themeSlice";

export function ThemeSync() {
  const mode = useAppSelector(useThemeMode);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    // Leave nativewind's colorScheme alone in "system" mode so it keeps
    // tracking the OS appearance; only force it once the user picks explicitly.
    if (mode !== 'system') {
      setColorScheme(mode);
    }
  }, [mode, setColorScheme]);

  return null;
}
