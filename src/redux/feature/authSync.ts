// import { store } from "@/redux/store";
// import { logout, setUser } from "./authSlice";
// import { jwtDecode } from "jwt-decode";

// const isWeb =
//   typeof window !== "undefined" &&
//   typeof window.BroadcastChannel !== "undefined";

// let channel: BroadcastChannel | null = null;
// let initialized = false;

// if (isWeb) {
//   channel = new BroadcastChannel("auth-sync");
// }

// const isTokenValid = (token?: string | null) => {
//   if (!token) return false;
//   try {
//     const decoded: any = jwtDecode(token);
//     return decoded.exp > Date.now() / 1000;
//   } catch {
//     return false;
//   }
// };

// export const listenAuthChanges = () => {
//   if (!channel || initialized) return;
//   initialized = true;

//   channel.onmessage = (event) => {
//     const { type, payload } = event.data;

//     if (type === "LOGIN") {
//       const { user, token } = payload;

//       if (!isTokenValid(token)) {
//         store.dispatch(logout());
//         return;
//       }

//       // ✅ CORRECT
//       store.dispatch(setUser({ user, token }));
//     }

//     if (type === "LOGOUT") {
//       store.dispatch(logout());
//     }
//   };

//   // 🔐 validate persisted token once
//   const { token } = store.getState().auth;
//   if (token && !isTokenValid(token)) {
//     store.dispatch(logout());
//   }
// };

// export const broadcastLogin = (data: { user: any; token: string }) => {
//   if (!channel) return;
//   channel.postMessage({ type: "LOGIN", payload: data });
// };

// export const broadcastLogout = () => {
//   if (!channel) return;
//   channel.postMessage({ type: "LOGOUT" });
// };
// authSync.ts  (replace or add to existing file)
// authSync.ts

import { store } from "@/redux/store";
import { Platform } from "react-native";
import { baseApi } from "../api/baseApi";
import { logout, setUser } from "./authSlice";

// ── Web-only BroadcastChannel for multi-tab/window sync ──
let channel: BroadcastChannel | null = null;
let initialized = false;

if (Platform.OS === "web") {
  if (typeof window !== "undefined" && window.BroadcastChannel) {
    channel = new BroadcastChannel("auth_sync_channel");
  }
}

// ── Listen to broadcast messages (only on web) ──
export const listenAuthChanges = () => {
  if (Platform.OS !== "web" || !channel || initialized) return;
  initialized = true;

  channel.onmessage = (event) => {
    const { type, payload } = event.data || {};

    if (type === "LOGIN" && payload?.user) {
      store.dispatch(
        setUser({
          user: payload.user,
        }),
      );
      store.dispatch(baseApi.util.resetApiState());
    }

    if (type === "LOGOUT") {
      store.dispatch(logout());
      store.dispatch(baseApi.util.resetApiState());
    }
  };
};

// ── Broadcast login (call this after successful login) ──
export const broadcastLogin = (data: { user: any }) => {
  if (!channel) return;
  channel.postMessage({
    type: "LOGIN",
    payload: data,
  });
};

// ── Broadcast logout (call this when user explicitly logs out) ──
export const broadcastLogout = () => {
  if (!channel) return;
  channel.postMessage({ type: "LOGOUT" });
};

// Cross-platform check removed because HttpOnly cookies are invisible to JS
export const startTokenExpirationListener = () => () => {};
