import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLazyGetInstituteTransactionsQuery } from '@/redux/api/authApi';
import { showMessage } from '@/components/Toast/message';
import { DateFieldModal } from '../DateFieldModal';

interface DateToDateTabProps {
  instId: number;
}

function formatDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function DateToDateTab({ instId }: DateToDateTabProps) {
  const [from, setFrom] = useState(todayISO);
  const [to, setTo] = useState(todayISO);
  const [openField, setOpenField] = useState<'from' | 'to' | null>(null);

  const [fetchTransactions, { data, isFetching, isError, isSuccess, isUninitialized }] =
    useLazyGetInstituteTransactionsQuery();

  const handleSearch = () => {
    fetchTransactions({ id: instId, from, to });
  };

  const entries = data?.data ?? [];
  const total = data?.totalAmount ?? 0;

  useEffect(() => {
    if (isSuccess && entries.length === 0) {
      showMessage('info', 'No Data', 'No collection found in this date range.');
    }
  }, [isSuccess, entries.length]);

  return (
    <View>
      {/* Date range picker */}
      <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
        <Text className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
          Select Date Range
        </Text>
        <View className="flex-row gap-2.5">
          {[
            { key: 'from' as const, label: 'From', val: from },
            { key: 'to' as const, label: 'To', val: to },
          ].map((f) => (
            <View key={f.key} className="flex-1">
              <Text className="mb-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{f.label}</Text>
              <TouchableOpacity
                onPress={() => setOpenField(f.key)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 dark:border-slate-700 dark:bg-slate-900"
              >
                <Text className="text-[13px] text-slate-900 dark:text-white">{formatDisplay(f.val)}</Text>
                <Text className="text-sm">📅</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSearch}
          activeOpacity={0.8}
          disabled={isFetching}
          className={`mt-3 items-center rounded-lg bg-[#1e3a5f] py-2.5 ${isFetching ? 'opacity-70' : ''}`}
        >
          {isFetching ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-[13px] font-bold text-white">🔍 Search</Text>
          )}
        </TouchableOpacity>

        {!isUninitialized && !isFetching && !isError && (
          <View className="mt-3 flex-row items-center justify-between rounded-[10px] border border-green-200 bg-green-50 px-3 py-2.5 dark:border-green-900 dark:bg-green-950">
            <Text className="text-[13px] font-semibold text-green-700 dark:text-green-400">Total in Range</Text>
            <Text className="text-[17px] font-extrabold text-green-600 dark:text-green-400">৳{total.toLocaleString()}</Text>
          </View>
        )}
      </View>

      <DateFieldModal
        visible={openField === 'from'}
        title="Select From Date"
        value={from}
        onSelect={setFrom}
        onClose={() => setOpenField(null)}
      />
      <DateFieldModal
        visible={openField === 'to'}
        title="Select To Date"
        value={to}
        onSelect={setTo}
        onClose={() => setOpenField(null)}
      />

      {isUninitialized ? (
        <View className="items-center py-10">
          <Text className="text-sm text-slate-400">Select a date range and tap Search</Text>
        </View>
      ) : isError ? (
        <View className="items-center py-10">
          <Text className="text-sm text-slate-400">Failed to load transactions</Text>
        </View>
      ) : !isFetching && entries.length === 0 ? null : (
        <>
          <Text className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Day-wise Collection
          </Text>
          {entries.map((entry, i) => (
            <View
              key={i}
              className="mb-2 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
            >
              <View className="flex-row items-center gap-2.5">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <Text className="text-sm">📅</Text>
                </View>
                <Text className="text-[13px] font-bold text-slate-900 dark:text-white">
                  {formatDisplay(entry.date)}
                </Text>
              </View>
              <Text className="text-[15px] font-extrabold text-green-600 dark:text-green-400">
                ৳{entry.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
}
