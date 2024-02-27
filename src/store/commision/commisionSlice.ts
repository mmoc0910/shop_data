import { PayloadAction, createSlice } from "@reduxjs/toolkit";


// Define the initial state using that type
const initialState: number = 0;

const commisionSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCommision: (_, action: PayloadAction<number>) => action.payload,
  },
});

export const { setCommision } = commisionSlice.actions;
export default commisionSlice.reducer;
