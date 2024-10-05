import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface SatifyState {
  cash: number;
  rose: number;
  transaction: number;
  currentMoney: number;
  numberIntoduce: number;
  discount: number;
}

// Define the initial state using that type
const initialState: SatifyState = {
  cash: 0,
  rose: 0,
  transaction: 0,
  currentMoney: 0,
  numberIntoduce: 0,
  discount: 0,
};

const satisfySlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSatify: (_, action: PayloadAction<SatifyState>) => ({
      ...action.payload,
    }),
  },
});

export const { setSatify } = satisfySlice.actions;
export default satisfySlice.reducer;
