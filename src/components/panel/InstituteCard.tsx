import { View, Text, Pressable } from 'react-native';
import type { Institute } from '@/types';
import { PERIOD_KEYS, PERIOD_LABELS, fmt, rateColor } from '@/utils/formatters';
import { StatusDot } from './StatusDot';
import { CollectionBar } from './CollectionBar';

interface InstituteCardProps {
  inst: Institute;
  periodIdx: number;
  onPress: (id: number) => void;
}

export function InstituteCard({ inst, periodIdx, onPress }: InstituteCardProps) {
  const periodFee = inst.fee[PERIOD_KEYS[periodIdx]] as number;
  const accentColor = rateColor(inst.collectionRate);

  return (
    <View
      className="mb-3 rounded-2xl"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 }}
    >
      <View className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 pl-[19px] dark:border-slate-700 dark:bg-slate-800">
        {/* Left accent bar */}
        <View
          className="absolute bottom-0 left-0 top-0 w-[3px]"
          style={{ backgroundColor: accentColor }}
        />

        {/* Header row */}
        <View className="flex-row items-start justify-between">
          <View className="min-w-0 flex-1 pr-3">
            <View className="mb-1.5 flex-row items-center">
              <StatusDot active={inst.status === 'active'} />
              <Text selectable className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{inst.institute_id}</Text>
              <View className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-700">
                <Text selectable className="text-[9px] font-semibold text-slate-500 dark:text-slate-300">{inst.type}</Text>
              </View>
            </View>
            <Text selectable className="text-[15px] font-bold leading-5 text-slate-900 dark:text-white">{inst.name}</Text>
            <Text selectable className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              {inst.totalStudents} Students · {inst.upazila}, {inst.district}
            </Text>
          </View>
          <View className="shrink-0 items-end">
            <Text selectable className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{PERIOD_LABELS[periodIdx]}</Text>
            <Text
              className="mt-1 text-base font-extrabold"
              style={{ color: periodFee > 0 ? '#16a34a' : '#94a3b8' }}
              selectable
            >
              {periodFee > 0 ? fmt(periodFee) : 'Nil'}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View className="mt-3 flex-row rounded-xl bg-slate-50 py-2.5 dark:bg-slate-900/60">
          {[
            { label: 'Payable', value: fmt(inst.totalPayable), red: false },
            { label: 'Collected', value: fmt(inst.totalCollected), red: false },
            { label: 'Due', value: fmt(inst.dueAmount), red: true },
          ]?.map((s, i) => (
            <View key={i} className="flex-1 items-center border-slate-200 dark:border-slate-700" style={i > 0 ? { borderLeftWidth: 1 } : undefined}>
              <Text selectable className={`text-[13px] font-bold ${s.red ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                {s.value}
              </Text>
              <Text selectable className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Payment source breakdown (collected only) */}
        {inst.paymentSources && (
          <View className="mt-2 flex-row rounded-xl border border-slate-100 py-2.5 dark:border-slate-700">
            {[
              { label: 'Fees Mgmt.', value: fmt(inst.paymentSources.feesManagement.collected) },
              { label: 'Online Adm.', value: fmt(inst.paymentSources.onlineAdmission.collected) },
              { label: 'Open Payment', value: fmt(inst.paymentSources.openPayment.collected) },
            ].map((s, i) => (
              <View key={i} className="flex-1 items-center border-slate-100 dark:border-slate-700" style={i > 0 ? { borderLeftWidth: 1 } : undefined}>
                <Text selectable className="text-[12px] font-bold text-slate-600 dark:text-slate-300">
                  {s.value}
                </Text>
                <Text selectable className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500">{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        <CollectionBar rate={inst.collectionRate} />

        {/* Footer */}
        <View className="mt-3 flex-row items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-700">
          <Text
            selectable
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
            className="mr-2 flex-1 text-[10px] text-slate-400 dark:text-slate-500"
          >
            Last txn:{' '}
            <Text selectable className="font-semibold text-slate-500 dark:text-slate-400">
              {inst.lastTransaction} · {inst.lastTransactionTime}
            </Text>
          </Text>
          <Pressable onPress={() => onPress(inst.id)} hitSlop={8} className="shrink-0">
            <Text maxFontSizeMultiplier={1.2} className="text-[11px] font-bold text-blue-500">Details →</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
