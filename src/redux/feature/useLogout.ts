import { useState } from 'react';
import { useRouter } from 'expo-router';
import { showMessage } from '@/components/Toast/message';
import { useLogOutUserMutation } from '@/redux/api/authApi';
import { baseApi } from '@/redux/api/baseApi';
import { persistor } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from './authSlice';

export function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logOutUser, { isLoading }] = useLogOutUserMutation();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    let message = 'You have been logged out.';
    try {
      const res: any = await logOutUser().unwrap();
      message = res?.payload?.data?.message ?? message;
    } catch {
      // ignore — clear local session regardless
    }
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    await persistor.purge();
    showMessage('success', 'Logged Out', message);
    setLoggingOut(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace('/' as any);
  };

  return { handleLogout, loggingOut: loggingOut || isLoading };
}
