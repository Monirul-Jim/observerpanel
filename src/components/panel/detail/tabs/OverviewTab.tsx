import { View, Text, StyleSheet } from 'react-native';
import type { Institute } from '@/types';
import { PERIOD_KEYS, PERIOD_LABELS, fmtFull } from '@/utils/formatters';

const PERIOD_ICONS = ['📅', '📆', '🗓️', '📊'] as const;
const PERIOD_BGTINTS = ['#eff6ff', '#faf5ff', '#fffbeb', '#f0fdf4'] as const;

export function OverviewTab({ inst }: { inst: Institute }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Period Collection</Text>

      {PERIOD_KEYS.map((key, i) => {
        const fee = inst.fee[key] as number;
        return (
          <View key={key} style={styles.row}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.iconBox, { backgroundColor: PERIOD_BGTINTS[i] }]}>
                <Text style={{ fontSize: 16 }}>{PERIOD_ICONS[i]}</Text>
              </View>
              <Text style={styles.rowLabel}>{PERIOD_LABELS[i]}</Text>
            </View>
            <Text style={[styles.rowValue, !fee && { color: '#94a3b8' }]}>
              {fee > 0 ? fmtFull(fee) : '—'}
            </Text>
          </View>
        );
      })}

      <View style={styles.lastTxnBox}>
        <Text style={{ fontSize: 18 }}>🕐</Text>
        <View>
          <Text style={styles.lastTxnLabel}>Last Transaction</Text>
          <Text style={styles.lastTxnValue}>
            {inst.lastTransaction} · {inst.lastTransactionTime}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  lastTxnBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lastTxnLabel: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '600',
  },
  lastTxnValue: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '700',
    marginTop: 1,
  },
});
