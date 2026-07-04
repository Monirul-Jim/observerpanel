import { showMessage } from '@/components/Toast/message';
import { useForgotPasswordMutation } from '@/redux/api/authApi';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ForgetFormData = {
  email: string;
};

export default function ForgetPassword() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading: loading }] = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetFormData>({ defaultValues: { email: '' } });

  const onSubmit = async (data: ForgetFormData) => {
    try {
      await forgotPassword(data).unwrap();
      setSent(true);
      showMessage('success', 'Email Sent', 'Check your inbox for the reset link.');
    } catch (err: any) {
      const errors = err?.data?.errors;
      const firstError = errors && (Object.values(errors)[0] as any);
      const message =
        firstError?.[0]?.message || err?.data?.message || 'Failed to send reset email';
      showMessage('error', 'Send Failed', String(message));
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#1e3a5f]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
        <View
          className="w-full max-w-[420px] rounded-3xl bg-white p-7"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="mb-4 flex-row items-center">
            <Text className="mr-1 text-lg text-slate-700">←</Text>
            <Text className="text-sm font-semibold text-slate-700">Back</Text>
          </TouchableOpacity>

          <Text className="mb-1 text-xl font-extrabold text-slate-900">Forgot Password</Text>
          <Text className="mb-6 text-[13px] text-slate-500">
            Enter your email and we'll send you a password reset link.
          </Text>

          {sent ? (
            <View className="items-center py-4">
              <Text className="mb-3 text-4xl">📧</Text>
              <Text className="mb-2 text-center text-base font-bold text-slate-900">Check your email</Text>
              <Text className="text-center text-[13px] text-slate-500">
                We've sent a password reset link to your email address.
              </Text>
            </View>
          ) : (
            <View className="mb-1">
              <Text className="mb-1.5 text-[13px] font-semibold text-gray-700">Email</Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`min-h-[50px] flex-row items-center rounded-xl border-[1.5px] bg-slate-50 px-3.5 py-2 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                  >
                    <Text className="mr-2.5 text-base">📧</Text>
                    <TextInput
                      className="flex-1 text-sm text-slate-900"
                      placeholder="employee@edu.gov.bd"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      returnKeyType="done"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text className="ml-1 mt-1 text-[11px] text-red-500">{errors.email.message}</Text>
              )}

              <TouchableOpacity
                className={`mt-5 min-h-[52px] items-center justify-center rounded-2xl bg-[#1e3a5f] px-4 py-3 ${loading ? 'opacity-70' : ''}`}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-base font-bold tracking-wide text-white">Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
