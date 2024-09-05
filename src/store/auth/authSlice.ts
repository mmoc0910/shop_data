import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface AuthState {
  level?: number;
  email?: string;
  role?: 1 | 2 | 3;
  phone?: string;
  country?: "vi" | "ci" | "ir" | "orther";
  purpose?: number;
  money?: number;
  transaction?: number;
  cash?: number;
  _id?: string;
  introduceCode?: string;
  username?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

// Define the initial state using that type
const initialState: AuthState = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (_, action: PayloadAction<AuthState>) =>
      action.payload
        ? {
            ...action.payload,
          }
        : {},
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
