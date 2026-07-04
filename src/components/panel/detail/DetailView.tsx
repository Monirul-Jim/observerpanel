import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { Institute } from '@/types';
import { DetailHero } from './DetailHero';
import { OverviewTab } from './tabs/OverviewTab';
import { SummaryTab } from './tabs/SummaryTab';
import { DateToDateTab } from './tabs/DateToDateTab';

interface DetailViewProps {
  inst: Institute;
  onBack: () => void;
}

type TabId = 'overview' | 'summary' | 'date2date';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'summary', label: 'Summary' },
  { id: 'date2date', label: 'Date to Date' },
];

export function DetailView({ inst, onBack }: DetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
        <TouchableOpacity onPress={onBack} className="h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-slate-100 dark:bg-slate-700" activeOpacity={0.75}>
          <Text className="text-lg leading-[22px] text-slate-700 dark:text-slate-200">←</Text>
        </TouchableOpacity>
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-bold text-slate-900 dark:text-white" numberOfLines={1}>{inst.name}</Text>
          <Text className="mt-px text-[11px] text-slate-400 dark:text-slate-500">{inst.code} · {inst.type}</Text>
        </View>
      </View>

      {/* Everything below scrolls together as one screen */}
      <ScrollView
        className="flex-1 bg-slate-50 dark:bg-slate-900"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <DetailHero inst={inst} />

        {/* Tab bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="shrink-0 grow-0 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
          contentContainerClassName="px-1"
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`border-b-2 px-3.5 py-2.5 ${activeTab === tab.id ? 'border-[#1e3a5f]' : 'border-transparent'}`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-xs ${activeTab === tab.id ? 'font-bold text-[#1e3a5f] dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab content */}
        <View className="p-4">
          {activeTab === 'overview' && <OverviewTab inst={inst} />}
          {activeTab === 'summary' && <SummaryTab inst={inst} />}
          {activeTab === 'date2date' && <DateToDateTab />}
        </View>
      </ScrollView>
    </View>
  );
}
