import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { Institute } from '@/types';
import { PERIOD_KEYS, PERIOD_LABELS, fmt } from '@/utils/formatters';
import { OBSERVER } from '@/data/mock-data';
import { Avatar } from './Avatar';
import { PeriodTabs } from './PeriodTabs';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useLogout } from '@/redux/feature/useLogout';
import { useDarkMode } from '@/redux/feature/useDarkMode';

interface SummarySectionProps {
  institutes: Institute[];
  periodIdx: number;
  setPeriodIdx: (idx: number) => void;
}

const STAT_ACCENTS = ['#ffffff', '#7dd3fc', '#fca5a5', '#fcd34d', '#c4b5fd', '#86efac'] as const;
const STAT_ICONS = ['💰', '✅', '⚠️', '🧾', '📝', '💳'] as const;

export function SummarySection({ institutes, periodIdx, setPeriodIdx }: SummarySectionProps) {
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const { themeMode, setThemeMode } = useDarkMode();
  const { handleLogout: doLogout, loggingOut } = useLogout();
  const [menuVisible, setMenuVisible] = useState(false);

  const observerName = profile?.name ?? OBSERVER.name;
  const observerDesignation = profile?.designation ?? OBSERVER.designation;
  const observerZone = profile?.division ?? OBSERVER.zone;

  const handleLogout = async () => {
    setMenuVisible(false);
    await doLogout();
  };

  const totals = institutes.reduce(
    (acc, inst) => ({
      periodFee: acc.periodFee + (inst.fee[PERIOD_KEYS[periodIdx]] as number),
      payable: acc.payable + inst.totalPayable,
      collected: acc.collected + inst.totalCollected,
      due: acc.due + inst.dueAmount,
      feesManagement: acc.feesManagement + (inst.paymentSources?.feesManagement.collected ?? 0),
      onlineAdmission: acc.onlineAdmission + (inst.paymentSources?.onlineAdmission.collected ?? 0),
      openPayment: acc.openPayment + (inst.paymentSources?.openPayment.collected ?? 0),
    }),
    { periodFee: 0, payable: 0, collected: 0, due: 0, feesManagement: 0, onlineAdmission: 0, openPayment: 0 },
  );

  const achievedPct = totals.payable > 0
    ? Math.round((totals.collected / totals.payable) * 100)
    : 0;

  const stats = [
    { label: 'Total Payable', value: fmt(totals.payable), sub: undefined },
    { label: 'Total Collected', value: fmt(totals.collected), sub: `${achievedPct}% achieved` },
    { label: 'Total Due', value: fmt(totals.due), sub: 'Pending' },
    { label: 'Fees Management', value: fmt(totals.feesManagement), sub: 'Collected' },
    { label: 'Online Admission', value: fmt(totals.onlineAdmission), sub: 'Collected' },
    { label: 'Open Payment', value: fmt(totals.openPayment), sub: 'Collected' },
  ];

  return (
    <View className="flex-1 px-4 pt-4">
      {/* Observer Info */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="mb-0.5 text-[10px] uppercase tracking-wider text-white/45">
            Observer Panel
          </Text>
          <Text className="text-[15px] font-extrabold text-white" numberOfLines={1}>
            {observerName}
          </Text>
          <Text className="mt-0.5 text-[11px] text-white/55" numberOfLines={1}>
            {observerDesignation} · {observerZone}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)} activeOpacity={0.8}>
          <View
            className="rounded-full"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 }}
          >
            <Avatar name={observerName} size={46} color="#2563eb" uri={profile?.avatar_url} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Account Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start', alignItems: 'flex-end', padding: 16 }}
          onPress={() => setMenuVisible(false)}
        >
          <View
            className="rounded-2xl bg-white py-2 dark:bg-slate-800"
            style={{
              marginTop: 60,
              width: 220,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center border-b border-slate-100 px-3.5 py-2.5 dark:border-slate-700">
              <Avatar name={observerName} size={36} color="#2563eb" uri={profile?.avatar_url} />
              <View className="ml-2.5 flex-1">
                <Text className="text-[13px] font-bold text-slate-900 dark:text-white" numberOfLines={1}>
                  {observerName}
                </Text>
                <Text className="text-[11px] text-slate-500 dark:text-slate-400" numberOfLines={1}>
                  {observerDesignation}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="flex-row items-center px-3.5 py-3"
              onPress={() => {
                setMenuVisible(false);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                router.push('/profile' as any);
              }}
              activeOpacity={0.7}
            >
              <Text className="mr-2.5 text-base">👤</Text>
              <Text className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">Profile</Text>
            </TouchableOpacity>

            <View className="flex-row items-center justify-between px-3.5 py-3">
              <View className="flex-row items-center">
                <Text className="mr-2.5 text-base">🌙</Text>
                <Text className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">Appearance</Text>
              </View>
              <View className="flex-row rounded-full bg-slate-100 p-0.5 dark:bg-slate-900">
                {(
                  [
                    { key: 'system', icon: '⚙️' },
                    { key: 'light', icon: '☀️' },
                    { key: 'dark', icon: '🌙' },
                  ] as const
                ).map((opt) => {
                  const active = themeMode === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setThemeMode(opt.key)}
                      activeOpacity={0.75}
                      className={`h-6 w-6 items-center justify-center rounded-full ${active ? 'bg-white dark:bg-slate-700' : ''}`}
                      style={
                        active
                          ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 1 }
                          : undefined
                      }
                    >
                      <Text style={{ fontSize: 10 }}>{opt.icon}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 }}
              onPress={handleLogout}
              disabled={loggingOut}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, marginRight: 10 }}>🚪</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#ef4444' }}>
                {loggingOut ? 'Logging out...' : 'Logout'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Period Tabs */}
      <View className="mb-3">
        <PeriodTabs periodIdx={periodIdx} setPeriodIdx={setPeriodIdx} variant="dark" />
      </View>

      {/* Today/period collection + stats grid — stretched to fill remaining height */}
      <View className="flex-1 justify-between gap-2 pb-2">
        <View className="justify-center rounded-xl border border-white/10 bg-white/[0.07] p-3" style={{ flex: 1.6 }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-2.5 h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Text className="text-base">📅</Text>
              </View>
              <Text className="text-[13px] font-medium text-white/60">
                {PERIOD_LABELS[periodIdx]} Collection
              </Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#4ade80' }}>{fmt(totals.periodFee)}</Text>
          </View>
        </View>

        {/* Stats Grid – 2 columns × 3 rows */}
        <View className="flex-1 flex-row gap-2">
          {stats.slice(0, 2).map((s, i) => (
            <StatCard key={i} {...s} icon={STAT_ICONS[i]} accent={STAT_ACCENTS[i]} />
          ))}
        </View>
        <View className="flex-1 flex-row gap-2">
          {stats.slice(2, 4).map((s, i) => (
            <StatCard key={i + 2} {...s} icon={STAT_ICONS[i + 2]} accent={STAT_ACCENTS[i + 2]} />
          ))}
        </View>
        <View className="flex-1 flex-row gap-2">
          {stats.slice(4, 6).map((s, i) => (
            <StatCard key={i + 4} {...s} icon={STAT_ICONS[i + 4]} accent={STAT_ACCENTS[i + 4]} />
          ))}
        </View>
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
    <View className="flex-1 justify-center rounded-xl border border-white/10 bg-white/[0.07] p-2.5">
      <View className="mb-1.5 h-6 w-6 items-center justify-center rounded-full bg-white/10">
        <Text className="text-xs">{icon}</Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: '800', color: accent }}>{value}</Text>
      <Text className="mt-0.5 text-[10px] text-white/50">{label}</Text>
      {sub && <Text className="mt-px text-[9px] text-white/35">{sub}</Text>}
    </View>
  );
}
