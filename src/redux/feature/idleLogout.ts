import { AppState, Platform, GestureResponderEvent } from "react-native";
import { store } from "@/redux/store";
import { logout } from "./authSlice";
import { broadcastLogout } from "./authSync";

let idleTimer: ReturnType<typeof setTimeout> | null = null;
let lastActivity = Date.now();

const IDLE_TIMEOUT = 60 * 60 * 1000; // 1 hour idle timeout

const resetTimer = () => {
  lastActivity = Date.now();

  if (idleTimer) clearTimeout(idleTimer);

  idleTimer = setTimeout(() => {
    store.dispatch(logout());
    if (Platform.OS === "web") broadcastLogout();
  }, IDLE_TIMEOUT);
};

export const startIdleLogoutListener = (
  rootTouchHandler?: (e: GestureResponderEvent) => void,
) => {
  resetTimer();

  // ── Mobile: App state changes ──
  const appStateSub = AppState.addEventListener("change", (state) => {
    if (state === "active") {
      resetTimer();
    }
  });

  // ── Mobile: Touch events on root view ──
  let removeTouchListener: (() => void) | null = null;

  if (Platform.OS !== "web" && rootTouchHandler) {
    removeTouchListener = () => {};
  }

  // ── Web: User interactions ──
  let removeWebListeners: (() => void) | null = null;
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => window.addEventListener(event, resetTimer, true));
    removeWebListeners = () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer, true),
      );
    };
  }

  return () => {
    if (idleTimer) clearTimeout(idleTimer);
    appStateSub.remove();
    removeWebListeners?.();
    removeTouchListener?.();
  };
};
