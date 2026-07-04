import { View, Text, Pressable, Linking } from 'react-native';
import type { Institute } from '@/types';
import { fmtFull } from '@/utils/formatters';

export function SummaryTab({ inst }: { inst: Institute }) {
  const rows: { label: string; value: string; accent?: string; link?: string }[] = [
    { label: 'Institute Name', value: inst.name },
    { label: 'Institute ID', value: String(inst.code) },
    { label: 'Type', value: inst.type },
    { label: 'Division', value: inst.division },
    { label: 'District', value: inst.district },
    { label: 'Upazila', value: inst.upazila },
    { label: 'Mobile', value: inst.mobile, link: `tel:${inst.mobile}` },
    { label: 'Email', value: inst.email },
    { label: 'Total Students', value: `${inst.totalStudents} students` },
    { label: 'Total Payable', value: fmtFull(inst.totalPayable) },
    { label: 'Collected', value: fmtFull(inst.totalCollected), accent: '#16a34a' },
    { label: 'Due', value: fmtFull(inst.dueAmount), accent: '#ef4444' },
    { label: 'Collection Rate', value: `${inst.collectionRate}%` },
    { label: 'Status', value: inst.status === 'active' ? 'Active ✓' : 'Inactive' },
  ];

  return (
    <View className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
      {rows.map((row, i) => (
        <View
          key={i}
          className={`flex-row items-center justify-between px-4 py-2.5 ${
            i !== rows.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''
          } ${i % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-neutral-50 dark:bg-slate-800/60'}`}
        >
          <Text className="flex-1 text-[13px] text-slate-500 dark:text-slate-400">{row.label}</Text>
          {row.link ? (
            <Pressable className="flex-1" onPress={() => Linking.openURL(row.link!)} hitSlop={8}>
              <Text className="text-right text-[13px] font-bold text-blue-500" numberOfLines={2}>
                {row.value}
              </Text>
            </Pressable>
          ) : (
            <Text
              className="flex-1 text-right text-[13px] font-bold text-slate-900 dark:text-white"
              style={row.accent ? { color: row.accent } : undefined}
              numberOfLines={2}
            >
              {row.value}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
