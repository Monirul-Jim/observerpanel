import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { Institute } from '@/types';
import { DetailHero } from './DetailHero';
import { OverviewTab } from './tabs/OverviewTab';
import { TransactionsTab } from './tabs/TransactionsTab';
import { SummaryTab } from './tabs/SummaryTab';
import { DateToDateTab } from './tabs/DateToDateTab';

interface DetailViewProps {
  inst: Institute;
  onBack: () => void;
}

type TabId = 'overview' | 'transactions' | 'summary' | 'date2date';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'summary', label: 'Summary' },
  { id: 'date2date', label: 'Date to Date' },
];

export function DetailView({ inst, onBack }: DetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.75}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{inst.name}</Text>
          <Text style={styles.headerMeta}>{inst.code} · {inst.type}</Text>
        </View>
      </View>

      {/* Hero */}
      <DetailHero inst={inst} />

      {/* Tab bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.tabContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === 'overview' && <OverviewTab inst={inst} />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'summary' && <SummaryTab inst={inst} />}
        {activeTab === 'date2date' && <DateToDateTab />}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  backIcon: {
    fontSize: 18,
    color: '#334155',
    lineHeight: 22,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerMeta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexShrink: 0,
    flexGrow: 0,
  },
  tabBarContent: {
    paddingHorizontal: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#1e3a5f',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    whiteSpace: 'nowrap',
  } as any,
  tabTextActive: {
    color: '#1e3a5f',
    fontWeight: '700',
  },
  tabContent: {
    padding: 16,
  },
});
