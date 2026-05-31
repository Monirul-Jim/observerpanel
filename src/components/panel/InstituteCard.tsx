import { View, Text, Pressable, StyleSheet } from 'react-native';
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
    <Pressable
      onPress={() => onPress(inst)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.metaRow}>
            <StatusDot active={inst.status === 'active'} />
            <Text style={styles.code}>{inst.code}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{inst.type}</Text>
            </View>
          </View>
          <Text style={styles.name} numberOfLines={2}>{inst.name}</Text>
          <Text style={styles.meta}>{inst.totalStudents} Students · {inst.upazila}, {inst.district}</Text>
        </View>
        <View style={styles.periodBox}>
          <Text style={styles.periodLabel}>{PERIOD_LABELS[periodIdx]}</Text>
          <Text style={[styles.periodValue, { color: periodFee > 0 ? '#16a34a' : '#94a3b8' }]}>
            {periodFee > 0 ? fmt(periodFee) : 'Nil'}
          </Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total Collected', value: fmt(inst.totalCollected), red: false },
          { label: 'Total Payable', value: fmt(inst.totalPayable), red: false },
          { label: 'Due', value: fmt(inst.dueAmount), red: true },
        ].map((s, i) => (
          <View key={i} style={styles.statCell}>
            <Text style={[styles.statValue, s.red && { color: '#ef4444' }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <CollectionBar rate={inst.collectionRate} />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.lastTxnText}>
          Last txn:{' '}
          <Text style={styles.lastTxnHighlight}>
            {inst.lastTransaction} · {inst.lastTransactionTime}
          </Text>
        </Text>
        <Text style={styles.detailsLink}>Details →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    paddingLeft: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  code: {
    fontSize: 10,
    color: '#64748b',
  },
  typeBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  typeText: {
    fontSize: 9,
    color: '#475569',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 20,
    paddingRight: 8,
  },
  meta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  periodBox: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  periodLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  periodValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  lastTxnText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  lastTxnHighlight: {
    color: '#64748b',
    fontWeight: '600',
  },
  detailsLink: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
  },
});
