import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AuthState {
  token?: string;
}

// Define the initial state using that type
const initialState: AuthState = {
  token: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (_, action: PayloadAction<AuthState>) => ({
      token: action.payload.token,
    }),
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
