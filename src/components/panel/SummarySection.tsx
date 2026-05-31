import { View, Text, TouchableOpacity } from 'react-native';
import type { Institute } from '@/types';
import { PERIOD_KEYS, PERIOD_LABELS, fmt } from '@/utils/formatters';
import { OBSERVER } from '@/data/mock-data';
import { Avatar } from './Avatar';

interface SummarySectionProps {
  institutes: Institute[];
  periodIdx: number;
  setPeriodIdx: (idx: number) => void;
}

const STAT_ICONS = ['📅', '🏫', '✅', '⚠️'] as const;
const STAT_ACCENTS = ['#4ade80', '#ffffff', '#7dd3fc', '#fca5a5'] as const;

export function SummarySection({ institutes, periodIdx, setPeriodIdx }: SummarySectionProps) {
  const totals = institutes.reduce(
    (acc, inst) => ({
      periodFee: acc.periodFee + (inst.fee[PERIOD_KEYS[periodIdx]] as number),
      payable: acc.payable + inst.totalPayable,
      collected: acc.collected + inst.totalCollected,
      due: acc.due + inst.dueAmount,
    }),
    { periodFee: 0, payable: 0, collected: 0, due: 0 },
  );

  const achievedPct = totals.payable > 0
    ? Math.round((totals.collected / totals.payable) * 100)
    : 0;

  const stats = [
    { label: `${PERIOD_LABELS[periodIdx]} Collection`, value: fmt(totals.periodFee), sub: undefined },
    { label: 'Total Payable', value: fmt(totals.payable), sub: undefined },
    { label: 'Total Collected', value: fmt(totals.collected), sub: `${achievedPct}% achieved` },
    { label: 'Total Due', value: fmt(totals.due), sub: 'Pending' },
  ];

  return (
    <View style={{ backgroundColor: '#1e3a5f', paddingHorizontal: 16, paddingTop: 14 }}>
      {/* Observer Info */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2, letterSpacing: 0.8, textTransform: 'uppercase' }}>
            Observer Panel
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>
            {OBSERVER.name}
          </Text>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
            {OBSERVER.designation} · {OBSERVER.zone}
          </Text>
        </View>
        <Avatar name={OBSERVER.name} size={44} color="#2563eb" />
      </View>

      {/* Period Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 3, marginBottom: 12 }}>
        {PERIOD_LABELS.map((lbl, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setPeriodIdx(i)}
            activeOpacity={0.8}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: periodIdx === i ? '#fff' : 'transparent',
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: periodIdx === i ? '700' : '500',
                color: periodIdx === i ? '#1e3a5f' : 'rgba(255,255,255,0.65)',
              }}
            >
              {lbl}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Grid – 2 columns × 2 rows */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        {stats.slice(0, 2).map((s, i) => (
          <StatCard key={i} {...s} icon={STAT_ICONS[i]} accent={STAT_ACCENTS[i]} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        {stats.slice(2, 4).map((s, i) => (
          <StatCard key={i + 2} {...s} icon={STAT_ICONS[i + 2]} accent={STAT_ACCENTS[i + 2]} />
        ))}
      </View>
    </View>
  );
}

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  accent: string;
  sub?: string;
}

function StatCard({ icon, value, label, accent, sub }: StatCardProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.09)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12,
        padding: 10,
      }}
    >
      <Text style={{ fontSize: 16, marginBottom: 4 }}>{icon}</Text>
      <Text style={{ fontSize: 15, fontWeight: '800', color: accent }}>{value}</Text>
      <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</Text>
      {sub && <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{sub}</Text>}
    </View>
  );
}
