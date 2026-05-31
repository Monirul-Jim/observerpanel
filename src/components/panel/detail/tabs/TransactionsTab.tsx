import { View, Text, StyleSheet } from 'react-native';
import { TRANSACTIONS } from '@/data/mock-data';

export function TransactionsTab() {
  return (
    <View>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      {TRANSACTIONS.map((tx) => (
        <View key={tx.id} style={styles.row}>
          <View style={styles.iconBox}>
            <Text style={{ fontSize: 16 }}>💳</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.studentName}>{tx.student}</Text>
            <Text style={styles.meta}>{tx.class} · {tx.type}</Text>
            <View style={styles.methodBadge}>
              <Text style={styles.methodText}>{tx.method}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.amount}>৳{tx.amount.toLocaleString()}</Text>
            <Text style={styles.time}>{tx.time}</Text>
          </View>
        </View>
      ))}
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
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
  methodBadge: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  methodText: {
    fontSize: 9,
    color: '#64748b',
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16a34a',
  },
  time: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
});
