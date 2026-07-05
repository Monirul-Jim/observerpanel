import { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, Platform, RefreshControl, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LayerFilter } from '@/types';
import { HIERARCHY, OBSERVER } from '@/data/mock-data';
import { SummarySection } from '@/components/panel/SummarySection';
import { FilterBar } from '@/components/panel/FilterBar';
import { PeriodTabs } from '@/components/panel/PeriodTabs';
import { InstituteCard } from '@/components/panel/InstituteCard';
import { DetailView } from '@/components/panel/detail/DetailView';
import { usePanelNav } from '@/context/PanelNavContext';
import { useGetInstituteInfoQuery } from '@/redux/api/authApi';

export default function PanelScreen() {
  const insets = useSafeAreaInsets();
  const { activeTab } = usePanelNav();

  const [selectedInstId, setSelectedInstId] = useState<number | null>(null);

  // Tapping Home/Institutes in the bottom nav while a detail view is open
  // should back out of it, since the nav now stays visible there too.
  useEffect(() => {
    setSelectedInstId(null);
  }, [activeTab]);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodIdx, setPeriodIdx] = useState(0);
  const [layerFilter, setLayerFilter] = useState<LayerFilter>({ level: 'upazila', value: 'all' });

  // Debounce search so we don't hit the API on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // Filtering happens server-side — see README "Institute List" query params
  const { data: institutes = [], isFetching, refetch } = useGetInstituteInfoQuery({
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(layerFilter.value !== 'all' && {
      layer_level: layerFilter.level,
      layer_value: layerFilter.value,
    }),
  });

  // Observer can see levels at or above their own level
  const observerLevelIdx = HIERARCHY.findIndex((h) => h.id === OBSERVER.level);
  const visibleLayers = HIERARCHY.slice(0, observerLevelIdx + 1);

  // Unique values for active layer
  const layerValues = useMemo(
    () => ['all', ...new Set(institutes.map((i) => i[layerFilter.level] as string))],
    [institutes, layerFilter.level],
  );

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
      {selectedInstId ? (
        /* ── Detail View ───────────────────────────── */
        <View className="flex-1 bg-white dark:bg-slate-900" style={{ paddingTop: headerTopPad }}>
          <DetailView instId={selectedInstId} onBack={() => setSelectedInstId(null)} />
        </View>
      ) : (
        /* ── Home / Institutes tabs ────────────────── */
        <View className="w-full max-w-[430px] flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900">
          {activeTab === 'home' ? (
            // Dark background fills the whole tab so short content never
            // reveals white space beneath it
            <View className="flex-1 bg-[#1e3a5f]">
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingTop: headerTopPad, paddingBottom: bottomPad + 20 }}
                refreshControl={
                  <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#ffffff" />
                }
              >
                <SummarySection
                  institutes={institutes}
                  periodIdx={periodIdx}
                  setPeriodIdx={setPeriodIdx}
                />
              </ScrollView>
            </View>
          ) : (
            <FlatList
              className="flex-1"
              data={institutes}
              keyExtractor={(inst) => String(inst.id)}
              renderItem={({ item }) => (
                <View className="px-4">
                  <InstituteCard inst={item} periodIdx={periodIdx} onPress={setSelectedInstId} />
                </View>
              )}
              contentContainerStyle={{ paddingBottom: bottomPad + 20 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#1e3a5f" />
              }
              windowSize={7}
              maxToRenderPerBatch={8}
              initialNumToRender={8}
              removeClippedSubviews={Platform.OS !== 'web'}
              ListHeaderComponent={
                <>
                  <View
                    className="border-b border-slate-200 bg-white px-4 pb-2 dark:border-slate-700 dark:bg-slate-800"
                    style={{ paddingTop: headerTopPad + 12 }}
                  >
                    <PeriodTabs periodIdx={periodIdx} setPeriodIdx={setPeriodIdx} variant="light" />
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

                  <Text className="mb-3 px-4 pt-3 text-base font-bold text-slate-700 dark:text-slate-200">
                    {institutes.length} institution{institutes.length !== 1 ? 's' : ''} found
                  </Text>
                </>
              }
              ListEmptyComponent={
                <View className="items-center px-4 py-12">
                  <Text className="mb-2 text-3xl">🔍</Text>
                  <Text className="text-sm text-slate-400">No institutions found</Text>
                </View>
              }
            />
          )}
        </View>
      )}
    </View>
  );
}
