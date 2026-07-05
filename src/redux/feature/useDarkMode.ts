import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMode, useThemeMode } from './themeSlice';

export function useDarkMode() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(useThemeMode);
  const systemScheme = useSystemColorScheme();
  const { setColorScheme } = useNativewindColorScheme();
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  const setThemeMode = (mode: 'system' | 'light' | 'dark') => {
    dispatch(setMode(mode));
    setColorScheme(mode);
  };

  const toggleDarkMode = (value: boolean) => setThemeMode(value ? 'dark' : 'light');

  return { isDark, themeMode, setThemeMode, toggleDarkMode };
}
