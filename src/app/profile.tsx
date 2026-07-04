// import { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Platform,
//   ActivityIndicator,
//   Switch,
//   TextInput,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system/legacy';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useLogout } from '@/redux/feature/useLogout';
// import { useDarkMode } from '@/redux/feature/useDarkMode';
// import { useGetProfileQuery, useUpdateProfileMutation } from '@/redux/api/authApi';
// import { showMessage } from '@/components/Toast/message';
// import { Avatar } from '@/components/panel/Avatar';

// type FieldKey = 'organization' | 'designation' | 'mobile' | 'email' | 'address' | 'upazila' | 'district' | 'division';

// // Decode base64 to raw bytes without relying on `atob` (not guaranteed to
// // exist in the Hermes global scope).
// function base64ToBytes(base64: string): Uint8Array {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
//   const clean = base64.replace(/[^A-Za-z0-9+/]/g, '');
//   const bytes: number[] = [];
//   for (let i = 0; i < clean.length; i += 4) {
//     const e1 = chars.indexOf(clean[i]);
//     const e2 = chars.indexOf(clean[i + 1]);
//     const e3 = chars.indexOf(clean[i + 2]);
//     const e4 = chars.indexOf(clean[i + 3]);
//     bytes.push((e1 << 2) | (e2 >> 4));
//     if (e3 !== -1 && clean[i + 2] !== undefined) bytes.push(((e2 & 15) << 4) | (e3 >> 2));
//     if (e4 !== -1 && clean[i + 3] !== undefined) bytes.push(((e3 & 3) << 6) | e4);
//   }
//   return new Uint8Array(bytes);
// }

// const FIELDS: { label: string; key: FieldKey; keyboardType?: 'email-address' | 'phone-pad' }[] = [
//   { label: 'Organization', key: 'organization' },
//   { label: 'Designation', key: 'designation' },
//   { label: 'Mobile', key: 'mobile', keyboardType: 'phone-pad' },
//   { label: 'Email', key: 'email', keyboardType: 'email-address' },
//   { label: 'Address', key: 'address' },
//   { label: 'Upazila', key: 'upazila' },
//   { label: 'District', key: 'district' },
//   { label: 'Division', key: 'division' },
// ];

// export default function ProfileScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { data: user, isLoading: loadingProfile } = useGetProfileQuery();
//   const { isDark, toggleDarkMode } = useDarkMode();
//   const { handleLogout, loggingOut } = useLogout();
//   const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
//   const headerTopPad = Platform.OS === 'web' ? 0 : insets.top;

//   const [editMode, setEditMode] = useState(false);
//   const [form, setForm] = useState<Record<FieldKey, string>>({
//     organization: '',
//     designation: '',
//     mobile: '',
//     email: '',
//     address: '',
//     upazila: '',
//     district: '',
//     division: '',
//   });

//   const [name, setName] = useState('');
//   const [avatarUri, setAvatarUri] = useState<string | null>(null);

//   const startEditing = () => {
//     setName(user?.name ?? '');
//     setForm({
//       organization: user?.organization ?? '',
//       designation: user?.designation ?? '',
//       mobile: user?.mobile ?? '',
//       email: user?.email ?? '',
//       address: user?.address ?? '',
//       upazila: user?.upazila ?? '',
//       district: user?.district ?? '',
//       division: user?.division ?? '',
//     });
//     setAvatarUri(null);
//     setEditMode(true);
//   };

//   const pickAvatar = async () => {
//     const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!perm.granted) {
//       showMessage('error', 'Permission Needed', 'Please allow photo library access to change your avatar.');
//       return;
//     }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'],
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.7,
//     });
//     if (!result.canceled && result.assets?.[0]) {
//       setAvatarUri(result.assets[0].uri);
//     }
//   };

//   const handleSave = async () => {
//     if (!user) return;
//     const formData = new FormData();
//     formData.append('name', name);
//     Object.entries(form).forEach(([key, value]) => formData.append(key, value));
//     if (avatarUri) {
//       const fileName = avatarUri.split('/').pop() ?? 'avatar.jpg';
//       const ext = fileName.split('.').pop()?.toLowerCase() ?? 'jpg';
//       const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

//       if (Platform.OS === 'web') {
//         // Browsers' native FormData/fetch handle Blob-from-local-uri fine.
//         const blob = await (await fetch(avatarUri)).blob();
//         formData.append('avatar', blob, fileName);
//       } else {
//         // On native, Expo's global fetch ("winter" runtime) needs either a
//         // real Blob or a `.bytes()`-shaped object — and React Native's own
//         // Blob implementation can't be built from a raw ArrayBuffer, so
//         // `fetch(uri).blob()` fails here. Read the file as base64 instead
//         // and hand back a duck-typed object with `.bytes()`.
//         const base64 = await FileSystem.readAsStringAsync(avatarUri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });
//         const bytes = base64ToBytes(base64);
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         formData.append('avatar', {
//           name: fileName,
//           type: mimeType,
//           bytes: async () => bytes,
//         } as any);
//       }
//     }

//     try {
//       await updateProfile({ id: user.id, formData }).unwrap();
//       showMessage('success', 'Profile Updated', 'Your profile has been updated successfully.');
//       setEditMode(false);
//     } catch (err: any) {
//       const errors = err?.data?.errors;
//       console.log(errors)
//       const firstError = errors && (Object.values(errors)[0] as any);
//       const message = firstError?.[0]?.message || err?.data?.message || 'Failed to update profile';
//       showMessage('error', 'Update Failed', String(message));
//     }
//   };

//   const displayAvatarUri = editMode ? avatarUri ?? user?.avatar_url : user?.avatar_url;

//   if (loadingProfile && !user) {
//     return (
//       <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900">
//         <ActivityIndicator color="#1e3a5f" size="large" />
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-slate-50 dark:bg-slate-900">
//       {/* Header */}
//       <View className="bg-[#1e3a5f] px-4 pb-5" style={{ paddingTop: headerTopPad + 14 }}>
//         <View className="mb-4 flex-row items-center justify-between">
//           <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center">
//             <Text className="mr-1 text-lg text-white">←</Text>
//             <Text className="text-sm font-semibold text-white">Back</Text>
//           </TouchableOpacity>

//           {!editMode && (
//             <TouchableOpacity onPress={startEditing} activeOpacity={0.7} className="flex-row items-center">
//               <Text className="mr-1 text-base">✏️</Text>
//               <Text className="text-sm font-semibold text-white">Edit</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         <View className="items-center">
//           <TouchableOpacity onPress={editMode ? pickAvatar : undefined} activeOpacity={editMode ? 0.7 : 1}>
//             <View>
//               <Avatar name={name || user?.name || 'Observer'} size={72} color="#2563eb" uri={displayAvatarUri} />
//               {editMode && (
//                 <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-white">
//                   <Text className="text-xs">📷</Text>
//                 </View>
//               )}
//             </View>
//           </TouchableOpacity>

//           {editMode ? (
//             <TextInput
//               className="mt-3 min-w-[160px] border-b border-white/40 pb-1 text-center text-lg font-extrabold text-white"
//               value={name}
//               onChangeText={setName}
//               placeholder="Name"
//               placeholderTextColor="rgba(255,255,255,0.5)"
//             />
//           ) : (
//             <Text className="mt-3 text-lg font-extrabold text-white">{user?.name ?? '—'}</Text>
//           )}
//           <Text className="mt-1 text-xs text-white/60">{editMode ? form.designation : user?.designation ?? '—'}</Text>
//         </View>
//       </View>

//       {/* Details Card */}
//       <ScrollView
//         className="flex-1"
//         contentContainerClassName="p-4"
//         contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
//         showsVerticalScrollIndicator={false}
//       >
//         <View
//           className="rounded-2xl bg-white p-4 dark:bg-slate-800"
//           style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}
//         >
//           {FIELDS.map((f, i) => (
//             <View
//               key={f.key}
//               className={`flex-row items-center justify-between py-3 ${i !== FIELDS.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
//             >
//               <Text className="text-[13px] text-slate-500 dark:text-slate-400">{f.label}</Text>
//               {editMode ? (
//                 <TextInput
//                   className="ml-3 flex-1 text-right text-[13px] font-semibold text-slate-900 dark:text-white"
//                   value={form[f.key]}
//                   onChangeText={(v) => setForm((prev) => ({ ...prev, [f.key]: v }))}
//                   keyboardType={f.keyboardType}
//                   autoCapitalize={f.keyboardType === 'email-address' ? 'none' : 'words'}
//                   placeholder={f.label}
//                   placeholderTextColor="#94a3b8"
//                 />
//               ) : (
//                 <Text className="max-w-[65%] text-right text-[13px] font-semibold text-slate-900 dark:text-white" numberOfLines={2}>
//                   {user?.[f.key] || '—'}
//                 </Text>
//               )}
//             </View>
//           ))}
//         </View>

//         {editMode ? (
//           <View className="mt-4 flex-row gap-3">
//             <TouchableOpacity
//               className="flex-1 items-center justify-center rounded-2xl bg-slate-200 py-3.5 dark:bg-slate-700"
//               onPress={() => setEditMode(false)}
//               disabled={saving}
//               activeOpacity={0.7}
//             >
//               <Text className="text-sm font-bold text-slate-600 dark:text-slate-200">Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="flex-1 items-center justify-center rounded-2xl bg-[#1e3a5f] py-3.5"
//               onPress={handleSave}
//               disabled={saving}
//               activeOpacity={0.85}
//             >
//               {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text className="text-sm font-bold text-white">Save Changes</Text>}
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <>
//             {/* Preferences Card */}
//             <View
//               className="mt-4 rounded-2xl bg-white p-4 dark:bg-slate-800"
//               style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}
//             >
//               <View className="flex-row items-center justify-between">
//                 <View className="flex-row items-center">
//                   <Text className="mr-2.5 text-base">🌙</Text>
//                   <Text className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">Dark Mode</Text>
//                 </View>
//                 <Switch
//                   value={isDark}
//                   onValueChange={toggleDarkMode}
//                   trackColor={{ false: '#e2e8f0', true: '#1e3a5f' }}
//                   thumbColor="#fff"
//                 />
//               </View>
//             </View>

//             <TouchableOpacity
//               className="mt-4 flex-row items-center justify-center rounded-2xl bg-white py-3.5 dark:bg-slate-800"
//               style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}
//               onPress={handleLogout}
//               disabled={loggingOut}
//               activeOpacity={0.7}
//             >
//               {loggingOut ? (
//                 <ActivityIndicator color="#ef4444" size="small" />
//               ) : (
//                 <>
//                   <Text className="mr-2 text-base">🚪</Text>
//                   <Text className="text-sm font-bold text-red-500">Logout</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// }
import { Avatar } from "@/components/panel/Avatar";
import { useGetProfileQuery } from "@/redux/api/authApi";
import { useDarkMode } from "@/redux/feature/useDarkMode";
import { useLogout } from "@/redux/feature/useLogout";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FieldKey =
  | "organization"
  | "designation"
  | "mobile"
  | "email"
  | "address"
  | "upazila"
  | "district"
  | "division";

const FIELDS: { label: string; key: FieldKey }[] = [
  { label: "Organization", key: "organization" },
  { label: "Designation", key: "designation" },
  { label: "Mobile", key: "mobile" },
  { label: "Email", key: "email" },
  { label: "Address", key: "address" },
  { label: "Upazila", key: "upazila" },
  { label: "District", key: "district" },
  { label: "Division", key: "division" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: user, isLoading: loadingProfile } = useGetProfileQuery();
  const { isDark, toggleDarkMode } = useDarkMode();
  const { handleLogout, loggingOut } = useLogout();
  const headerTopPad = Platform.OS === "web" ? 0 : insets.top;

  if (loadingProfile && !user) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900">
        <ActivityIndicator color="#1e3a5f" size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <View
        className="bg-[#1e3a5f] px-4 pb-5"
        style={{ paddingTop: headerTopPad + 14 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="mb-4 flex-row items-center"
        >
          <Text className="mr-1 text-lg text-white">←</Text>
          <Text className="text-sm font-semibold text-white">Back</Text>
        </TouchableOpacity>

        <View className="items-center">
          <Avatar
            name={user?.name ?? "Observer"}
            size={72}
            color="#2563eb"
            uri={user?.avatar_url}
          />
          <Text className="mt-3 text-lg font-extrabold text-white">
            {user?.name ?? "—"}
          </Text>
          <Text className="mt-1 text-xs text-white/60">
            {user?.designation ?? "—"}
          </Text>
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
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {FIELDS.map((f, i) => (
            <View
              key={f.key}
              className={`flex-row items-center justify-between py-3 ${i !== FIELDS.length - 1 ? "border-b border-slate-100 dark:border-slate-700" : ""}`}
            >
              <Text className="text-[13px] text-slate-500 dark:text-slate-400">
                {f.label}
              </Text>
              <Text
                className="max-w-[65%] text-right text-[13px] font-semibold text-slate-900 dark:text-white"
                numberOfLines={2}
              >
                {user?.[f.key] || "—"}
              </Text>
            </View>
          ))}
        </View>

        {/* Preferences Card */}
        <View
          className="mt-4 rounded-2xl bg-white p-4 dark:bg-slate-800"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="mr-2.5 text-base">🌙</Text>
              <Text className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#e2e8f0", true: "#1e3a5f" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity
          className="mt-4 flex-row items-center justify-center rounded-2xl bg-white py-3.5 dark:bg-slate-800"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
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
