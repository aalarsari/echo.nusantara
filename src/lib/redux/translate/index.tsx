import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface translate {
  selectedLanguage: string;
}

const initialState: translate = {
  selectedLanguage: "en",
};

export const LanguageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload;
    },
  },
});

export const { setLanguage } = LanguageSlice.actions;
export const translate = LanguageSlice.reducer;
