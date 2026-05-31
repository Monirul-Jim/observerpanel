import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { HierarchyItem, LayerFilter } from '@/types';

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  visibleLayers: HierarchyItem[];
  layerFilter: LayerFilter;
  onLayerLevelChange: (level: string) => void;
  onLayerValueChange: (value: string) => void;
  layerValues: string[];
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
}

const STATUS_FILTERS = [
  { id: 'all', label: 'All Status' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'due', label: 'High Due' },
] as const;

export function FilterBar({
  search,
  onSearchChange,
  visibleLayers,
  layerFilter,
  onLayerLevelChange,
  onLayerValueChange,
  layerValues,
  statusFilter,
  onStatusFilterChange,
}: FilterBarProps) {
  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search institution..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={onSearchChange}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Hierarchy layer selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chipContent}>
        {visibleLayers.map((layer) => {
          const active = layerFilter.level === layer.id;
          return (
            <TouchableOpacity
              key={layer.id}
              onPress={() => onLayerLevelChange(layer.id)}
              activeOpacity={0.75}
              style={[styles.darkChip, active && styles.darkChipActive]}
            >
              <Text style={[styles.darkChipText, active && styles.darkChipTextActive]}>
                {layer.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Layer value filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chipContent}>
        {layerValues.map((val) => {
          const active = layerFilter.value === val;
          return (
            <TouchableOpacity
              key={val}
              onPress={() => onLayerValueChange(val)}
              activeOpacity={0.75}
              style={[styles.outlineChip, active && styles.outlineChipActive]}
            >
              <Text style={[styles.outlineChipText, active && styles.outlineChipTextActive]}>
                {val === 'all' ? 'All' : val}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Status filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chipContent}>
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              onPress={() => onStatusFilterChange(f.id)}
              activeOpacity={0.75}
              style={[styles.darkChip, active && styles.darkChipActive]}
            >
              <Text style={[styles.darkChipText, active && styles.darkChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  chipRow: {
    marginBottom: 8,
  },
  chipContent: {
    gap: 6,
    paddingRight: 4,
  },
  // Dark pill chips (hierarchy level + status)
  darkChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  darkChipActive: {
    backgroundColor: '#1e3a5f',
  },
  darkChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  darkChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  // Outline chips (layer values)
  outlineChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  outlineChipActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  outlineChipText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748b',
  },
  outlineChipTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
