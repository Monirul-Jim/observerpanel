import { setRichToastRef } from "@/components/Toast/message";
import RichToast from "@/components/Toast/Toast";
import { ThemeSync } from "@/components/ThemeSync";
import UpdateBanner from "@/components/UpdateBanner/UpdateBanner";
import { persistor, store } from "@/redux/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemeSync />
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        </PersistGate>
      </Provider>
      <RichToast ref={(ref) => setRichToastRef(ref)} />
      <UpdateBanner />
    </>
  );
}
