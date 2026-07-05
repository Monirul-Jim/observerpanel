import { View, Text, TouchableOpacity } from 'react-native';
import { PERIOD_LABELS } from '@/utils/formatters';

interface PeriodTabsProps {
  periodIdx: number;
  setPeriodIdx: (idx: number) => void;
  variant?: 'dark' | 'light';
}

export function PeriodTabs({ periodIdx, setPeriodIdx, variant = 'dark' }: PeriodTabsProps) {
  const isDark = variant === 'dark';

  return (
    <View
      className={`flex-row rounded-[10px] p-1 ${
        isDark ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-700'
      }`}
    >
      {PERIOD_LABELS.map((lbl, i) => {
        const active = periodIdx === i;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => setPeriodIdx(i)}
            activeOpacity={0.8}
            className={`flex-1 items-center rounded-lg py-2 ${
              active ? (isDark ? 'bg-white' : 'bg-[#1e3a5f]') : ''
            }`}
            style={
              active
                ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 2 }
                : undefined
            }
          >
            <Text
              className={`text-[11px] ${
                active
                  ? isDark
                    ? 'font-bold text-[#1e3a5f]'
                    : 'font-bold text-white'
                  : isDark
                    ? 'font-medium text-white/65'
                    : 'font-medium text-slate-500 dark:text-slate-300'
              }`}
            >
              {lbl}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
