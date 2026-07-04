import { View, Text, Pressable } from 'react-native';
import type { Institute } from '@/types';
import { PERIOD_KEYS, PERIOD_LABELS, fmt, rateColor } from '@/utils/formatters';
import { StatusDot } from './StatusDot';
import { CollectionBar } from './CollectionBar';

interface InstituteCardProps {
  inst: Institute;
  periodIdx: number;
  onPress: (inst: Institute) => void;
}

export function InstituteCard({ inst, periodIdx, onPress }: InstituteCardProps) {
  const periodFee = inst.fee[PERIOD_KEYS[periodIdx]] as number;
  const accentColor = rateColor(inst.collectionRate);

  return (
    <View
      className="mb-2.5 rounded-2xl"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
    >
      <View className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 pl-[18px] dark:border-slate-700 dark:bg-slate-800">
        {/* Left accent bar */}
        <View
          className="absolute bottom-0 left-0 top-0 w-1 rounded-l-2xl"
          style={{ backgroundColor: accentColor }}
        />

        {/* Header row */}
        <View className="flex-row items-start justify-between">
          <View className="min-w-0 flex-1">
            <View className="mb-1 flex-row items-center">
              <StatusDot active={inst.status === 'active'} />
              <Text selectable={true} className="text-[10px] text-slate-500 dark:text-slate-400">{inst.code}</Text>
              <View className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-700">
                <Text selectable={true} className="text-[9px] text-slate-600 dark:text-slate-300">{inst.type}</Text>
              </View>
            </View>
            <Text selectable={true} className="pr-2 text-sm font-bold leading-5 text-slate-900 dark:text-white">{inst.name}</Text>
            <Text selectable={true} className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
              {inst.totalStudents} Students · {inst.upazila}, {inst.district}
            </Text>
          </View>
          <View className="shrink-0 items-end">
            <Text selectable={true} className="text-[10px] text-slate-500 dark:text-slate-400">{PERIOD_LABELS[periodIdx]}</Text>
            <Text
              className="mt-0.5 text-base font-extrabold"
              style={{ color: periodFee > 0 ? '#16a34a' : '#94a3b8' }}
              selectable={true}
            >
              {periodFee > 0 ? fmt(periodFee) : 'Nil'}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View className="mt-2.5 flex-row border-y border-slate-100 py-2 dark:border-slate-700">
          {[
            { label: 'Total Payable', value: fmt(inst.totalPayable), red: false },
            { label: 'Total Collected', value: fmt(inst.totalCollected), red: false },
            { label: 'Due', value: fmt(inst.dueAmount), red: true },
          ].map((s, i) => (
            <View key={i} className="flex-1 items-center">
              <Text selectable={true} className={`text-xs font-bold ${s.red ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                {s.value}
              </Text>
              <Text selectable={true} className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">{s.label}</Text>
            </View>
          ))}
        </View>

        <CollectionBar rate={inst.collectionRate} />

        {/* Footer */}
        <View className="mt-2 flex-row items-center justify-between">
          <Text selectable={true} className="text-[10px] text-slate-400 dark:text-slate-500">
            Last txn:{' '}
            <Text selectable={true} className="font-semibold text-slate-500 dark:text-slate-400">
              {inst.lastTransaction} · {inst.lastTransactionTime}
            </Text>
          </Text>
          <Pressable onPress={() => onPress(inst)} hitSlop={8}>
            <Text className="text-[11px] font-semibold text-blue-500">Details →</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
