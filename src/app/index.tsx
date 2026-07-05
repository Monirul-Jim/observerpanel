import { showMessage } from "@/components/Toast/message";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/feature/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

type LoginFormData = {
  email: string;
  password: string;
};

const socials = [
  { icon: "logo-linkedin", url: "https://www.linkedin.com/company/automateitbd" },
  { icon: "logo-facebook", url: "https://www.facebook.com/automateitbd" },
  { icon: "logo-youtube", url: "https://www.youtube.com/@automateitlimited" },
  { icon: "call", url: "tel:+8801335127799" }, // Sorasori Call / Direct Mobile Call
  { icon: "headset", url: "tel:+8809613241234" }, // IP Call Helpline
  { icon: "logo-whatsapp", url: "https://wa.me/+8801335127799" }, // WhatsApp
] as const;

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading: loading }] = useLoginUserMutation();

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace("/panel" as any);
    }
  }, [user, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginUser(data).unwrap();
      const user = res?.payload?.data?.user;

      dispatch(setUser({ user: { id: user.id } }));
      showMessage(
        "success",
        "Login Successful",
        `Welcome, ${user?.name ?? ""}!`,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace("/panel" as any);
    } catch (err: any) {
      const errors = err?.data?.errors;
      const firstError = errors && (Object.values(errors)[0] as any);
      const message =
        firstError?.[0]?.message ||
        err?.data?.message ||
        "Invalid email or password";
      showMessage("error", "Login Failed", String(message));
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#1e3a5f]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="grow"
        contentContainerClassName="items-center px-5"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Branding ─────────────────────────────── */}
        <View className="mb-8 items-center">
          <View
            className="mb-3.5 h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-[#2563eb]"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-[32px]">🏛️</Text>
          </View>
          <Text className="text-[26px] font-extrabold tracking-wide text-white">
            Observer Panel
          </Text>
          <Text className="mt-1 text-center text-xs text-white/55">
            Ministry of Education, Bangladesh
          </Text>
        </View>

        {/* ── Card ─────────────────────────────────── */}
        <View
          className="w-full max-w-[420px] rounded-3xl bg-white p-7"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Text className="mb-1 text-xl font-extrabold text-slate-900">
            Sign In
          </Text>
          <Text className="mb-6 text-[13px] text-slate-500">
            Enter your credentials to access the panel
          </Text>

          {/* Employee ID / Email */}
          <View className="mb-4">
            <Text className="mb-1.5 text-[13px] font-semibold text-gray-700">
              Employee ID / Email
            </Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Employee ID or Email is required",
                minLength: { value: 3, message: "Too short" },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`min-h-[50px] flex-row items-center rounded-xl border-[1.5px] bg-slate-50 px-3.5 py-2 ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-slate-200"
                  }`}
                >
                  <Text className="mr-2.5 text-base">👤</Text>
                  <TextInput
                    className="flex-1 text-sm text-slate-900"
                    placeholder="employee@edu.gov.bd"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text className="ml-1 mt-1 text-[11px] text-red-500">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Password */}
          <View className="mb-2">
            <View className="mb-1.5 flex-row items-center justify-between">
              <Text className="text-[13px] font-semibold text-gray-700">
                Password
              </Text>
            </View>
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: { value: 4, message: "Password too short" },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`min-h-[50px] flex-row items-center rounded-xl border-[1.5px] bg-slate-50 px-3.5 py-2 ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-slate-200"
                  }`}
                >
                  <Text className="mr-2.5 text-base">🔒</Text>
                  <TextInput
                    className="flex-1 text-sm text-slate-900"
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((p) => !p)}
                    className="p-1"
                  >
                    <Text className="text-base">
                      {showPassword ? "🙈" : "👁️"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() => router.push("/forget" as any)}
              hitSlop={8}
            >
              <Text className="text-[12px] mt-2 font-semibold text-blue-500">
                Forgot Password?
              </Text>
            </TouchableOpacity>
            {errors.password && (
              <Text className="ml-1 mt-1 text-[11px] text-red-500">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            className={`mt-2 min-h-[52px] items-center justify-center rounded-2xl bg-[#1e3a5f] px-4 py-3 ${loading ? "opacity-70" : ""}`}
            style={{
              shadowColor: "#1e3a5f",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-base font-bold tracking-wide text-white">
                Sign In →
              </Text>
            )}
          </TouchableOpacity>

          {/* Hint */}
          <Text className="mt-3.5 text-center text-[11px] text-slate-400">
            Use any valid email and password to continue
          </Text>
        </View>

        {/* ── Social / Support Links ────────────────── */}
        <View className="flex-row items-center justify-center mt-6" style={{ gap: 8 }}>
          {socials.map((s) => (
            <TouchableOpacity
              key={s.icon}
              onPress={() => Linking.openURL(s.url)}
              className="w-9 h-9 rounded-full bg-indigo-600 items-center justify-center"
              activeOpacity={0.8}
            >
              <Ionicons name={s.icon as any} size={16} color="white" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Footer ───────────────────────────────── */}
        <View className="mt-7 flex-row items-center gap-1.5 opacity-50">
          <Text className="text-xs">🔐</Text>
          <Text className="text-[11px] text-white">
            Secure Government Portal · v1.0
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
