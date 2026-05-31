import { View, Text, StyleSheet } from 'react-native';
import type { Institute } from '@/types';
import { fmtFull } from '@/utils/formatters';

export function SummaryTab({ inst }: { inst: Institute }) {
  const rows: { label: string; value: string; accent?: string }[] = [
    { label: 'Institute Name', value: inst.name },
    { label: 'Code', value: inst.code },
    { label: 'Type', value: inst.type },
    { label: 'Branch', value: inst.branch },
    { label: 'Principal Office', value: inst.principal },
    { label: 'GM Office', value: inst.gm },
    { label: 'Upazila', value: inst.upazila },
    { label: 'District', value: inst.district },
    { label: 'Division', value: inst.division },
    { label: 'Mobile', value: inst.mobile },
    { label: 'Email', value: inst.email },
    { label: 'Total Students', value: `${inst.totalStudents} students` },
    { label: 'Total Payable', value: fmtFull(inst.totalPayable) },
    { label: 'Collected', value: fmtFull(inst.totalCollected), accent: '#16a34a' },
    { label: 'Due', value: fmtFull(inst.dueAmount), accent: '#ef4444' },
    { label: 'Collection Rate', value: `${inst.collectionRate}%` },
    { label: 'Status', value: inst.status === 'active' ? 'Active ✓' : 'Inactive' },
  ];

  return (
    <View style={styles.table}>
      {rows.map((row, i) => (
        <View
          key={i}
          style={[
            styles.tableRow,
            i % 2 === 0 ? styles.rowEven : styles.rowOdd,
            i === rows.length - 1 && { borderBottomWidth: 0 },
          ]}
        >
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text
            style={[styles.rowValue, row.accent ? { color: row.accent } : undefined]}
            numberOfLines={2}
          >
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowEven: { backgroundColor: '#fff' },
  rowOdd: { backgroundColor: '#fafafa' },
  rowLabel: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
    flex: 1,
  },
});
