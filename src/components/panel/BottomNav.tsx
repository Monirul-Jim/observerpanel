import { View, Text, TouchableOpacity, Platform } from 'react-native';

export type PanelTab = 'home' | 'institutes';

interface BottomNavProps {
  // null when the bar is shown on a page (e.g. Profile) that isn't itself
  // one of the tabs — neither icon renders as active.
  activeTab: PanelTab | null;
  onTabChange: (tab: PanelTab) => void;
  bottomInset: number;
}

const TABS: { id: PanelTab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'institutes', label: 'Institutes', icon: '🏫' },
];

export function BottomNav({ activeTab, onTabChange, bottomInset }: BottomNavProps) {
  // Devices with a gesture bar report a small safe-area inset; devices with an
  // on-screen button bar report a larger one. Falling back to a fixed minimum
  // keeps the bar from feeling cramped on either.
  const paddingBottom = Math.max(bottomInset, Platform.OS === 'web' ? 10 : 8);

  return (
    <View
      className="w-full max-w-[430px] flex-row border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
      style={{
        paddingBottom,
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 12,
      }}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.75}
            className="flex-1 items-center justify-center py-1"
          >
            <Text className="text-[18px]" style={{ opacity: active ? 1 : 0.45 }}>
              {tab.icon}
            </Text>
            <Text
              className={`mt-0.5 text-[11px] ${
                active ? 'font-bold text-[#1e3a5f] dark:text-white' : 'font-medium text-slate-400 dark:text-slate-500'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
