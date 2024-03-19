import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CommisionState {
  value: number;
  min: number;
}
// Define the initial state using that type
const initialState: CommisionState = {
  value: 0,
  min: 0,
};

const commisionSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCommision: (_, action: PayloadAction<CommisionState>) => ({
      ...action.payload,
    }),
  },
});

export const { setCommision } = commisionSlice.actions;
export default commisionSlice.reducer;
