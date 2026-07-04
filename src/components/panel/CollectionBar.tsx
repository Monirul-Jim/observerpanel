import { View, Text } from 'react-native';
import { rateColor } from '@/utils/formatters';

export function CollectionBar({ rate }: { rate: number }) {
  const color = rateColor(rate);
  return (
    <View className="mt-3 w-full">
      <View className="mb-1 flex-row justify-between">
        <Text className="text-[11px] text-slate-500 dark:text-slate-400">Collection Rate</Text>
        <Text style={{ fontSize: 11, fontWeight: '700', color }}>{rate}%</Text>
      </View>
      <View className="h-1 overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
        <View
          style={{ height: '100%', width: `${rate}%` as `${number}%`, backgroundColor: color, borderRadius: 2 }}
        />
      </View>
    </View>
  );
}
