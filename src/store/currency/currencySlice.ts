import { PayloadAction, createSlice } from "@reduxjs/toolkit";



// Define the initial state using that type
const initialState: string = "en";

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (_, action: PayloadAction<string>) => action.payload,
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
