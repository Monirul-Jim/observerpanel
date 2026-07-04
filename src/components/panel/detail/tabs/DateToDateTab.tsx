import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { TRANSACTIONS } from '@/data/mock-data';
import { Avatar } from '../../Avatar';

export function DateToDateTab() {
  const [from, setFrom] = useState('2026-05-14');
  const [to, setTo] = useState('2026-05-21');

  // In a real app, filter transactions by date range
  const filtered = TRANSACTIONS;
  const total = filtered.reduce((s, t) => s + t.amount, 0);

  return (
    <View>
      {/* Date range picker */}
      <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
        <Text className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
          Select Date Range
        </Text>
        <View className="flex-row gap-2.5">
          {[
            { label: 'From', val: from, set: setFrom },
            { label: 'To', val: to, set: setTo },
          ].map((f) => (
            <View key={f.label} className="flex-1">
              <Text className="mb-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{f.label}</Text>
              <TextInput
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[13px] text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                value={f.val}
                onChangeText={f.set}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94a3b8"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          ))}
        </View>
        <View className="mt-3 flex-row items-center justify-between rounded-[10px] border border-green-200 bg-green-50 px-3 py-2.5 dark:border-green-900 dark:bg-green-950">
          <Text className="text-[13px] font-semibold text-green-700 dark:text-green-400">Total in Range</Text>
          <Text className="text-[17px] font-extrabold text-green-600 dark:text-green-400">৳{total.toLocaleString()}</Text>
        </View>
      </View>

      <Text className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
        Student-wise Details
      </Text>
      {filtered.map((tx) => (
        <View
          key={tx.id}
          className="mb-2 flex-row items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
        >
          <Avatar name={tx.student} size={34} color="#4f46e5" />
          <View className="min-w-0 flex-1">
            <Text className="text-[13px] font-bold text-slate-900 dark:text-white">{tx.student}</Text>
            <Text className="mt-px text-[11px] text-slate-400 dark:text-slate-500">{tx.class} · {tx.type}</Text>
            <Text className="mt-px text-[10px] text-slate-400 dark:text-slate-500">{tx.date} · {tx.time}</Text>
          </View>
          <View className="items-end">
            <Text className="text-[15px] font-extrabold text-green-600 dark:text-green-400">৳{tx.amount.toLocaleString()}</Text>
            <View className="mt-1 rounded-sm bg-slate-100 px-1.5 py-0.5 dark:bg-slate-700">
              <Text className="text-[9px] text-slate-500 dark:text-slate-300">{tx.method}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
