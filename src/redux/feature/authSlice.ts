import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Only the session identifier is persisted — full profile data is always
// fetched fresh from GET /observer/profile (see useGetProfileQuery) instead
// of being cached in Redux/storage.
export type TAuthSession = {
  id: number;
};

type TAuthState = {
  user: null | TAuthSession;
};

const initialState: TAuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentUser = (state: RootState) => state.auth.user;
