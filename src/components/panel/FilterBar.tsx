import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
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
    <View className="border-b border-slate-200 bg-white px-4 pb-1 pt-3 dark:border-slate-700 dark:bg-slate-800">
      {/* Search */}
      <View className="mb-2.5 min-h-[42px] flex-row items-center rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
        <Text className="mr-2 text-sm">🔍</Text>
        <TextInput
          className="flex-1 text-[13px] text-slate-900 dark:text-white"
          placeholder="Search institution..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={onSearchChange}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Hierarchy layer selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2" contentContainerClassName="gap-1.5 pr-1">
        {visibleLayers.map((layer) => {
          const active = layerFilter.level === layer.id;
          return (
            <TouchableOpacity
              key={layer.id}
              onPress={() => onLayerLevelChange(layer.id)}
              activeOpacity={0.75}
              className={`rounded-full px-3 py-1.5 ${active ? 'bg-[#1e3a5f]' : 'bg-slate-100 dark:bg-slate-700'}`}
            >
              <Text className={`text-[11px] ${active ? 'font-bold text-white' : 'font-medium text-slate-500 dark:text-slate-300'}`}>
                {layer.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Layer value filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2" contentContainerClassName="gap-1.5 pr-1">
        {layerValues.map((val) => {
          const active = layerFilter.value === val;
          return (
            <TouchableOpacity
              key={val}
              onPress={() => onLayerValueChange(val)}
              activeOpacity={0.75}
              className={`rounded-full border px-2.5 py-1 ${
                active
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
              }`}
            >
              <Text className={`text-[11px] ${active ? 'font-bold text-blue-500' : 'font-normal text-slate-500 dark:text-slate-400'}`}>
                {val === 'all' ? 'All' : val}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Status filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2" contentContainerClassName="gap-1.5 pr-1">
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              onPress={() => onStatusFilterChange(f.id)}
              activeOpacity={0.75}
              className={`rounded-full px-3 py-1.5 ${active ? 'bg-[#1e3a5f]' : 'bg-slate-100 dark:bg-slate-700'}`}
            >
              <Text className={`text-[11px] ${active ? 'font-bold text-white' : 'font-medium text-slate-500 dark:text-slate-300'}`}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
