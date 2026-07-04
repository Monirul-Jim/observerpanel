import { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, Platform, RefreshControl } from 'react-native';
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

  const [selectedInst, setSelectedInst] = useState<Institute | null>(null);
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
      {selectedInst ? (
        /* ── Detail View ───────────────────────────── */
        <View className="flex-1 bg-white dark:bg-slate-900" style={{ paddingTop: headerTopPad }}>
          <DetailView inst={selectedInst} onBack={() => setSelectedInst(null)} />
        </View>
      ) : (
        /* ── List View ─────────────────────────────── */
        <View className="w-full max-w-[430px] flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900">
          <FlatList
            className="flex-1"
            data={institutes}
            keyExtractor={(inst) => String(inst.id)}
            renderItem={({ item }) => (
              <View className="px-4">
                <InstituteCard inst={item} periodIdx={periodIdx} onPress={setSelectedInst} />
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
                {/* Dark header with top safe-area padding */}
                <View className="bg-[#1e3a5f]" style={{ paddingTop: headerTopPad }}>
                  <SummarySection
                    institutes={institutes}
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
        </View>
      )}
    </View>
  );
}
