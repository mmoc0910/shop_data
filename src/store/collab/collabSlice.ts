import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface CollabState {
  level1: number;
  level2: number;
  level3: number;
  minLevel1: number;
  minLevel2: number;
  minLevel3: number;
}

// Define the initial state using that type
const initialState: CollabState = {
  level1: 0,
  level2: 0,
  level3: 0,
  minLevel1: 0,
  minLevel2: 0,
  minLevel3: 0,
};

const collabSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCollab: (_, action: PayloadAction<CollabState>) => ({
      ...action.payload,
    }),
  },
});

export const { setCollab } = collabSlice.actions;
export default collabSlice.reducer;
