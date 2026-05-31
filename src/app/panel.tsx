import { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Institute, LayerFilter } from '@/types';
import { INSTITUTES, HIERARCHY, OBSERVER } from '@/data/mock-data';
import { SummarySection } from '@/components/panel/SummarySection';
import { FilterBar } from '@/components/panel/FilterBar';
import { InstituteCard } from '@/components/panel/InstituteCard';
import { DetailView } from '@/components/panel/detail/DetailView';

export default function PanelScreen() {
  const insets = useSafeAreaInsets();

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
    () => ['all', ...new Set(INSTITUTES.map((i) => i[layerFilter.level] as string))],
    [layerFilter.level],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return INSTITUTES.filter((inst) => {
      const matchSearch =
        inst.name.toLowerCase().includes(q) || inst.code.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && inst.status === 'active') ||
        (statusFilter === 'inactive' && inst.status === 'inactive') ||
        (statusFilter === 'due' && inst.dueAmount > 1000000);
      const matchLayer =
        layerFilter.value === 'all' || inst[layerFilter.level] === layerFilter.value;
      return matchSearch && matchStatus && matchLayer;
    });
  }, [search, statusFilter, layerFilter]);

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
    <View style={styles.root}>
      {selectedInst ? (
        /* ── Detail View ───────────────────────────── */
        <View style={{ flex: 1, paddingTop: headerTopPad, backgroundColor: '#fff' }}>
          <DetailView inst={selectedInst} onBack={() => setSelectedInst(null)} />
        </View>
      ) : (
        /* ── List View ─────────────────────────────── */
        <View style={styles.listRoot}>
          {/* Dark header with top safe-area padding */}
          <View style={{ backgroundColor: '#1e3a5f', paddingTop: headerTopPad }}>
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

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 20 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.resultCount}>
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
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>No institutions found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
    // Center content on wide screens (web)
    alignItems: Platform.OS === 'web' ? 'center' : undefined,
  },
  listRoot: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resultCount: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
