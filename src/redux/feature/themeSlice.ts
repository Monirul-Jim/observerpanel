import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type ThemeMode = "light" | "dark";

type TThemeState = {
  mode: ThemeMode;
};

const initialState: TThemeState = {
  mode: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = themeSlice.actions;
export default themeSlice.reducer;

export const useThemeMode = (state: RootState) => state.theme.mode;
