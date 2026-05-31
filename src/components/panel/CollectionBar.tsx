import { View, Text } from 'react-native';
import { rateColor } from '@/utils/formatters';

export function CollectionBar({ rate }: { rate: number }) {
  const color = rateColor(rate);
  return (
    <View style={{ width: '100%', marginTop: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
        <Text style={{ fontSize: 11, color: '#64748b' }}>Collection Rate</Text>
        <Text style={{ fontSize: 11, fontWeight: '700', color }}>{rate}%</Text>
      </View>
      <View style={{ height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
        <View
          style={{ height: '100%', width: `${rate}%` as `${number}%`, backgroundColor: color, borderRadius: 2 }}
        />
      </View>
    </View>
  );
}
