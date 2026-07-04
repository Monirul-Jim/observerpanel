import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Switch,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useLogout } from '@/redux/feature/useLogout';
import { useDarkMode } from '@/redux/feature/useDarkMode';
import { setUser } from '@/redux/feature/authSlice';
import { useUpdateProfileMutation } from '@/redux/api/authApi';
import { showMessage } from '@/components/Toast/message';
import { Avatar } from '@/components/panel/Avatar';

type FieldKey = 'organization' | 'designation' | 'mobile' | 'email' | 'address' | 'upazila' | 'district' | 'division';

const FIELDS: { label: string; key: FieldKey; keyboardType?: 'email-address' | 'phone-pad' }[] = [
  { label: 'Organization', key: 'organization' },
  { label: 'Designation', key: 'designation' },
  { label: 'Mobile', key: 'mobile', keyboardType: 'phone-pad' },
  { label: 'Email', key: 'email', keyboardType: 'email-address' },
  { label: 'Address', key: 'address' },
  { label: 'Upazila', key: 'upazila' },
  { label: 'District', key: 'district' },
  { label: 'Division', key: 'division' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);
  const { isDark, toggleDarkMode } = useDarkMode();
  const { handleLogout, loggingOut } = useLogout();
  const [updateProfile, { isLoading: saving ,error}] = useUpdateProfileMutation();
  const headerTopPad = Platform.OS === 'web' ? 0 : insets.top;

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Record<FieldKey, string>>({
    organization: '',
    designation: '',
    mobile: '',
    email: '',
    address: '',
    upazila: '',
    district: '',
    division: '',
  });
  console.log(error);
  
  const [name, setName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const startEditing = () => {
    setName(user?.name ?? '');
    setForm({
      organization: user?.organization ?? '',
      designation: user?.designation ?? '',
      mobile: user?.mobile ?? '',
      email: user?.email ?? '',
      address: user?.address ?? '',
      upazila: user?.upazila ?? '',
      district: user?.district ?? '',
      division: user?.division ?? '',
    });
    setAvatarUri(null);
    setEditMode(true);
  };

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showMessage('error', 'Permission Needed', 'Please allow photo library access to change your avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    const formData = new FormData();
    formData.append('name', name);
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (avatarUri) {
      const fileName = avatarUri.split('/').pop() ?? 'avatar.jpg';
      const ext = fileName.split('.').pop()?.toLowerCase() ?? 'jpg';
      const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

      if (Platform.OS === 'web') {
        // Web's FormData needs a real Blob/File — the {uri,name,type} object
        // trick only works with React Native's native FormData polyfill.
        const blob = await (await fetch(avatarUri)).blob();
        formData.append('avatar', blob, fileName);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData.append('avatar', {
          uri: avatarUri,
          name: fileName,
          type: mimeType,
        } as any);
      }
    }

    try {
      const res = await updateProfile({ id: user.id, formData }).unwrap();
      const updatedUser = res?.payload?.data?.user;
      dispatch(setUser({ user: updatedUser ?? { ...user, name, ...form } }));
      showMessage('success', 'Profile Updated', 'Your profile has been updated successfully.');
      setEditMode(false);
    } catch (err: any) {
      console.log(err);
      const errors = err?.data?.errors;
      const firstError = errors && (Object.values(errors)[0] as any);
      const message = firstError?.[0]?.message || err?.data?.message || 'Failed to update profile';
      showMessage('error', 'Update Failed', String(message));
    }
  };

  const displayAvatarUri = editMode ? avatarUri ?? user?.avatar : user?.avatar;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <View className="bg-[#1e3a5f] px-4 pb-5" style={{ paddingTop: headerTopPad + 14 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center">
            <Text className="mr-1 text-lg text-white">←</Text>
            <Text className="text-sm font-semibold text-white">Back</Text>
          </TouchableOpacity>

          {!editMode && (
            <TouchableOpacity onPress={startEditing} activeOpacity={0.7} className="flex-row items-center">
              <Text className="mr-1 text-base">✏️</Text>
              <Text className="text-sm font-semibold text-white">Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="items-center">
          <TouchableOpacity onPress={editMode ? pickAvatar : undefined} activeOpacity={editMode ? 0.7 : 1}>
            <View>
              <Avatar name={name || user?.name || 'Observer'} size={72} color="#2563eb" uri={displayAvatarUri} />
              {editMode && (
                <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-white">
                  <Text className="text-xs">📷</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {editMode ? (
            <TextInput
              className="mt-3 min-w-[160px] border-b border-white/40 pb-1 text-center text-lg font-extrabold text-white"
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          ) : (
            <Text className="mt-3 text-lg font-extrabold text-white">{user?.name ?? '—'}</Text>
          )}
          <Text className="mt-1 text-xs text-white/60">{editMode ? form.designation : user?.designation ?? '—'}</Text>
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
              {editMode ? (
                <TextInput
                  className="ml-3 flex-1 text-right text-[13px] font-semibold text-slate-900 dark:text-white"
                  value={form[f.key]}
                  onChangeText={(v) => setForm((prev) => ({ ...prev, [f.key]: v }))}
                  keyboardType={f.keyboardType}
                  autoCapitalize={f.keyboardType === 'email-address' ? 'none' : 'words'}
                  placeholder={f.label}
                  placeholderTextColor="#94a3b8"
                />
              ) : (
                <Text className="max-w-[65%] text-right text-[13px] font-semibold text-slate-900 dark:text-white" numberOfLines={2}>
                  {user?.[f.key] || '—'}
                </Text>
              )}
            </View>
          ))}
        </View>

        {editMode ? (
          <View className="mt-4 flex-row gap-3">
            <TouchableOpacity
              className="flex-1 items-center justify-center rounded-2xl bg-slate-200 py-3.5 dark:bg-slate-700"
              onPress={() => setEditMode(false)}
              disabled={saving}
              activeOpacity={0.7}
            >
              <Text className="text-sm font-bold text-slate-600 dark:text-slate-200">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center justify-center rounded-2xl bg-[#1e3a5f] py-3.5"
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text className="text-sm font-bold text-white">Save Changes</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
          </>
        )}
      </ScrollView>
    </View>
  );
}
