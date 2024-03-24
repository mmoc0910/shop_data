import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ServerType } from "../../type";

// Define a type for the slice state

// Define the initial state using that type
const initialState: ServerType[] = [];

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    setServer: (_, action: PayloadAction<ServerType[]>) => action.payload,
  },
});

export const { setServer } = serverSlice.actions;
export default serverSlice.reducer;
