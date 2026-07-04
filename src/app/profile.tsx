import { View, Text, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '@/redux/hooks';
import { useLogout } from '@/redux/feature/useLogout';
import { useDarkMode } from '@/redux/feature/useDarkMode';
import { Avatar } from '@/components/panel/Avatar';

const FIELDS: { label: string; key: 'organization' | 'designation' | 'mobile' | 'email' | 'address' | 'upazila' | 'district' | 'division' }[] = [
  { label: 'Organization', key: 'organization' },
  { label: 'Designation', key: 'designation' },
  { label: 'Mobile', key: 'mobile' },
  { label: 'Email', key: 'email' },
  { label: 'Address', key: 'address' },
  { label: 'Upazila', key: 'upazila' },
  { label: 'District', key: 'district' },
  { label: 'Division', key: 'division' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);
  const { isDark, toggleDarkMode } = useDarkMode();
  const { handleLogout, loggingOut } = useLogout();
  const headerTopPad = Platform.OS === 'web' ? 0 : insets.top;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <View className="bg-[#1e3a5f] px-4 pb-5" style={{ paddingTop: headerTopPad + 14 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="mb-4 flex-row items-center">
          <Text className="mr-1 text-lg text-white">←</Text>
          <Text className="text-sm font-semibold text-white">Back</Text>
        </TouchableOpacity>

        <View className="items-center">
          <Avatar name={user?.name ?? 'Observer'} size={72} color="#2563eb" />
          <Text className="mt-3 text-lg font-extrabold text-white">{user?.name ?? '—'}</Text>
          <Text className="mt-1 text-xs text-white/60">{user?.designation ?? '—'}</Text>
        </View>
      </View>

      {/* Details Card */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="rounded-2xl bg-white p-4 dark:bg-slate-800"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}
        >
          {FIELDS.map((f, i) => (
            <View
              key={f.key}
              className={`flex-row items-center justify-between py-3 ${i !== FIELDS.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
            >
              <Text className="text-[13px] text-slate-500 dark:text-slate-400">{f.label}</Text>
              <Text className="max-w-[65%] text-right text-[13px] font-semibold text-slate-900 dark:text-white" numberOfLines={2}>
                {user?.[f.key] || '—'}
              </Text>
            </View>
          ))}
        </View>

        {/* Preferences Card */}
        <View
          className="mt-4 rounded-2xl bg-white p-4 dark:bg-slate-800"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="mr-2.5 text-base">🌙</Text>
              <Text className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#e2e8f0', true: '#1e3a5f' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity
          className="mt-4 flex-row items-center justify-center rounded-2xl bg-white py-3.5 dark:bg-slate-800"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.7}
        >
          {loggingOut ? (
            <ActivityIndicator color="#ef4444" size="small" />
          ) : (
            <>
              <Text className="mr-2 text-base">🚪</Text>
              <Text className="text-sm font-bold text-red-500">Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
