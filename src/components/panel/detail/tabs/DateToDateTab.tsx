import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
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
      <View style={styles.rangeCard}>
        <Text style={styles.sectionTitle}>Select Date Range</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { label: 'From', val: from, set: setFrom },
            { label: 'To', val: to, set: setTo },
          ].map((f) => (
            <View key={f.label} style={{ flex: 1 }}>
              <Text style={styles.dateLabel}>{f.label}</Text>
              <TextInput
                style={styles.dateInput}
                value={f.val}
                onChangeText={f.set}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94a3b8"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          ))}
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total in Range</Text>
          <Text style={styles.totalValue}>৳{total.toLocaleString()}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Student-wise Details</Text>
      {filtered.map((tx) => (
        <View key={tx.id} style={styles.txRow}>
          <Avatar name={tx.student} size={34} color="#4f46e5" />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.studentName}>{tx.student}</Text>
            <Text style={styles.meta}>{tx.class} · {tx.type}</Text>
            <Text style={styles.dateText}>{tx.date} · {tx.time}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.amount}>৳{tx.amount.toLocaleString()}</Text>
            <View style={styles.methodBadge}>
              <Text style={styles.methodText}>{tx.method}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rangeCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  totalLabel: {
    fontSize: 13,
    color: '#15803d',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#16a34a',
  },
  txRow: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },
  dateText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16a34a',
  },
  methodBadge: {
    marginTop: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  methodText: {
    fontSize: 9,
    color: '#64748b',
  },
});
