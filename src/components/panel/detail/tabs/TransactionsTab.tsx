import { View, Text } from 'react-native';
import { TRANSACTIONS } from '@/data/mock-data';

export function TransactionsTab() {
  return (
    <View>
      <Text className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
        Recent Transactions
      </Text>
      {TRANSACTIONS.map((tx) => (
        <View
          key={tx.id}
          className="mb-2 flex-row items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
        >
          <View className="h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-blue-50 dark:bg-blue-950">
            <Text className="text-base">💳</Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[13px] font-bold text-slate-900 dark:text-white">{tx.student}</Text>
            <Text className="mt-px text-[11px] text-slate-400 dark:text-slate-500">{tx.class} · {tx.type}</Text>
            <View className="mt-1 self-start rounded-sm bg-slate-100 px-1.5 py-0.5 dark:bg-slate-700">
              <Text className="text-[9px] text-slate-500 dark:text-slate-300">{tx.method}</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-[15px] font-extrabold text-green-600 dark:text-green-400">৳{tx.amount.toLocaleString()}</Text>
            <Text className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">{tx.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
