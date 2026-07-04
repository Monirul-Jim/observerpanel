import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type TAuthUser = {
  id: number;
  name: string;
  organization: string;
  designation: string;
  address: string;
  upazila: string;
  district: string;
  division: string;
  mobile: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type TAuthState = {
  user: null | TAuthUser;
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
