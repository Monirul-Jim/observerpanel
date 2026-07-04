import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Institute, LayerFilter } from '@/types';
import { HIERARCHY, OBSERVER } from '@/data/mock-data';
import { SummarySection } from '@/components/panel/SummarySection';
import { FilterBar } from '@/components/panel/FilterBar';
import { InstituteCard } from '@/components/panel/InstituteCard';
import { DetailView } from '@/components/panel/detail/DetailView';
import { useGetInstituteInfoQuery } from '@/redux/api/authApi';

export default function PanelScreen() {
  const insets = useSafeAreaInsets();
  const { data: institutes = [] } = useGetInstituteInfoQuery();

  const [selectedInst, setSelectedInst] = useState<Institute | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodIdx, setPeriodIdx] = useState(0);
  const [layerFilter, setLayerFilter] = useState<LayerFilter>({ level: 'upazila', value: 'all' });

  // Observer can see levels at or above their own level
  const observerLevelIdx = HIERARCHY.findIndex((h) => h.id === OBSERVER.level);
  const visibleLayers = HIERARCHY.slice(0, observerLevelIdx + 1);

  // Unique values for active layer
  const layerValues = useMemo(
    () => ['all', ...new Set(institutes.map((i) => i[layerFilter.level] as string))],
    [institutes, layerFilter.level],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return institutes.filter((inst) => {
      const matchSearch =
        inst.name.toLowerCase().includes(q) || String(inst.code).toLowerCase().includes(q);
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && inst.status === 'active') ||
        (statusFilter === 'inactive' && inst.status === 'inactive') ||
        (statusFilter === 'due' && inst.dueAmount > 1000000);
      const matchLayer =
        layerFilter.value === 'all' || inst[layerFilter.level] === layerFilter.value;
      return matchSearch && matchStatus && matchLayer;
    });
  }, [institutes, search, statusFilter, layerFilter]);

  const handleLayerLevelChange = (level: string) => {
    setLayerFilter({ level, value: 'all' });
  };

  const handleLayerValueChange = (value: string) => {
    setLayerFilter((prev) => ({ ...prev, value }));
  };

  // The dark-blue header area "bleeds" into the status bar via paddingTop
  const headerTopPad = Platform.OS === 'web' ? 0 : insets.top;
  const bottomPad = insets.bottom;

  return (
    <View className={`flex-1 bg-slate-50 dark:bg-slate-900 ${Platform.OS === 'web' ? 'items-center' : ''}`}>
      {selectedInst ? (
        /* ── Detail View ───────────────────────────── */
        <View className="flex-1 bg-white dark:bg-slate-900" style={{ paddingTop: headerTopPad }}>
          <DetailView inst={selectedInst} onBack={() => setSelectedInst(null)} />
        </View>
      ) : (
        /* ── List View ─────────────────────────────── */
        <View className="w-full max-w-[430px] flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: bottomPad + 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Dark header with top safe-area padding */}
            <View className="bg-[#1e3a5f]" style={{ paddingTop: headerTopPad }}>
              <SummarySection
                institutes={filtered}
                periodIdx={periodIdx}
                setPeriodIdx={setPeriodIdx}
              />
            </View>

            <FilterBar
              search={search}
              onSearchChange={setSearch}
              visibleLayers={visibleLayers}
              layerFilter={layerFilter}
              onLayerLevelChange={handleLayerLevelChange}
              onLayerValueChange={handleLayerValueChange}
              layerValues={layerValues}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />

            <View className="px-4 pt-3">
              <Text className="mb-3 text-base font-bold text-slate-700 dark:text-slate-200">
                {filtered.length} institution{filtered.length !== 1 ? 's' : ''} found
              </Text>

              {filtered.map((inst) => (
                <InstituteCard
                  key={inst.id}
                  inst={inst}
                  periodIdx={periodIdx}
                  onPress={setSelectedInst}
                />
              ))}

              {filtered.length === 0 && (
                <View className="items-center py-12">
                  <Text className="mb-2 text-3xl">🔍</Text>
                  <Text className="text-sm text-slate-400">No institutions found</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
