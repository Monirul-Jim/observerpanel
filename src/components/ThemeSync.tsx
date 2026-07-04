import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { useAppSelector } from "@/redux/hooks";
import { useThemeMode } from "@/redux/feature/themeSlice";

export function ThemeSync() {
  const mode = useAppSelector(useThemeMode);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

  return null;
}
