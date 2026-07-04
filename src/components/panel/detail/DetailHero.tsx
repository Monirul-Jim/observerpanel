import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import type { Institute } from '@/types';
import { fmtFull, rateColor } from '@/utils/formatters';

export function DetailHero({ inst }: { inst: Institute }) {
  const crColor = rateColor(inst.collectionRate);

  const stats = [
    { icon: '💰', label: 'Total Payable', value: fmtFull(inst.totalPayable), accent: '#fff' },
    { icon: '✅', label: 'Total Collected', value: fmtFull(inst.totalCollected), accent: '#4ade80' },
    { icon: '⚠️', label: 'Due Amount', value: fmtFull(inst.dueAmount), accent: '#f87171' },
    { icon: '📊', label: 'Collection Rate', value: `${inst.collectionRate}%`, accent: crColor },
  ];

  return (
    <View style={styles.hero}>
      {/* Contact links */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        <TouchableOpacity
          style={[styles.contactBtn, { overflow: 'hidden' }]}
          onPress={() => Linking.openURL(`tel:${inst.mobile}`)}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 18 }}>📞</Text>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.contactMeta}>Mobile</Text>
            <Text style={styles.contactValue} numberOfLines={1}>{inst.mobile}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.contactBtn, { flex: 1, overflow: 'hidden' }]}
          onPress={() => Linking.openURL(`mailto:${inst.email}`)}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 18 }}>✉️</Text>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.contactMeta}>Email</Text>
            <Text style={styles.contactValue} numberOfLines={1}>{inst.email}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats grid – 2×2 */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        {stats.slice(0, 2).map((s, i) => (
          <HeroStat key={i} {...s} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {stats.slice(2, 4).map((s, i) => (
          <HeroStat key={i + 2} {...s} />
        ))}
      </View>
    </View>
  );
}

function HeroStat({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={{ fontSize: 16, marginBottom: 4 }}>{icon}</Text>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#1e3a5f',
    padding: 16,
    paddingBottom: 18,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  contactMeta: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 1,
  },
  contactValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7dd3fc',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
});
