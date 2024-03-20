import { PayloadAction, createSlice } from "@reduxjs/toolkit";



// Define the initial state using that type
const initialState: string = "en";

const languageSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setLanguage: (_, action: PayloadAction<string>) => action.payload,
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
