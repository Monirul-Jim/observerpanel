import { useColorScheme } from 'nativewind';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMode, useThemeMode } from './themeSlice';

export function useDarkMode() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(useThemeMode);
  const { setColorScheme } = useColorScheme();
  const isDark = themeMode === 'dark';

  const toggleDarkMode = (value: boolean) => {
    const mode = value ? 'dark' : 'light';
    dispatch(setMode(mode));
    setColorScheme(mode);
  };

  return { isDark, toggleDarkMode };
}
