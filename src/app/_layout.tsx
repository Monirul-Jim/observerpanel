import "../global.css";
import { useEffect } from "react";
import { setRichToastRef } from "@/components/Toast/message";
import RichToast from "@/components/Toast/Toast";
import { ThemeSync } from "@/components/ThemeSync";
import UpdateBanner from "@/components/UpdateBanner/UpdateBanner";
import { BottomNav } from "@/components/panel/BottomNav";
import { PanelNavProvider, usePanelNav } from "@/context/PanelNavContext";
import { persistor, store } from "@/redux/store";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

// Standalone/EAS builds require the native splash to be dismissed
// explicitly — without this pair, it can stay on screen forever even
// after the app has actually rendered underneath it.
SplashScreen.preventAutoHideAsync().catch(() => {});

// Routes that get the shared Home/Institutes bar. Auth screens (login,
// forgot/reset password) intentionally opt out.
const TABBED_ROUTES = ["/panel", "/profile"];

function GlobalBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeTab, setActiveTab } = usePanelNav();

  if (!TABBED_ROUTES.includes(pathname)) return null;

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (pathname !== "/panel") {
      router.replace("/panel");
    }
  };

  return (
    <BottomNav
      activeTab={pathname === "/panel" ? activeTab : null}
      onTabChange={handleTabChange}
      bottomInset={insets.bottom}
    />
  );
}

function HideSplashOnceReady() {
  // Runs only once PersistGate has finished rehydrating and this tree is
  // actually mounted — the pair with preventAutoHideAsync above.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <HideSplashOnceReady />
          <ThemeSync />
          <StatusBar style="light" />
          <PanelNavProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
            <GlobalBottomNav />
          </PanelNavProvider>
        </PersistGate>
      </Provider>
      <RichToast ref={(ref) => setRichToastRef(ref)} />
      <UpdateBanner />
    </SafeAreaProvider>
  );
}
