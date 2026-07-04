import { View, Text } from 'react-native';
import type { Institute } from '@/types';
import { PERIOD_KEYS, PERIOD_LABELS, fmtFull } from '@/utils/formatters';

const PERIOD_ICONS = ['📅', '📆', '🗓️', '📊'] as const;
const PERIOD_BGTINTS = ['#eff6ff', '#faf5ff', '#fffbeb', '#f0fdf4'] as const;

export function OverviewTab({ inst }: { inst: Institute }) {
  return (
    <View>
      <Text className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
        Period Collection
      </Text>

      {PERIOD_KEYS.map((key, i) => {
        const fee = inst.fee[key] as number;
        return (
          <View
            key={key}
            className="mb-2 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-3.5 dark:border-slate-700 dark:bg-slate-800"
          >
            <View className="flex-row items-center gap-2.5">
              <View className="h-9 w-9 items-center justify-center rounded-[10px]" style={{ backgroundColor: PERIOD_BGTINTS[i] }}>
                <Text className="text-base">{PERIOD_ICONS[i]}</Text>
              </View>
              <Text className="text-[13px] font-medium text-slate-600 dark:text-slate-300">{PERIOD_LABELS[i]}</Text>
            </View>
            <Text className={`text-base font-extrabold ${fee ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
              {fee > 0 ? fmtFull(fee) : '—'}
            </Text>
          </View>
        );
      })}

      <View className="mt-1 flex-row items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
        <Text className="text-lg">🕐</Text>
        <View>
          <Text className="text-[11px] font-semibold text-green-700 dark:text-green-400">Last Transaction</Text>
          <Text className="mt-px text-[13px] font-bold text-green-800 dark:text-green-300">
            {inst.lastTransaction} · {inst.lastTransactionTime}
          </Text>
        </View>
      </View>
    </View>
  );
}
