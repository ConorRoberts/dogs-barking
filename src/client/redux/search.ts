import { createSlice } from "@reduxjs/toolkit";

export interface SearchState {
  text: string;
  open: boolean;
}

const initialState: SearchState = {
  text: "",
  open: false,
};

const search = createSlice({
  name: "search",
  initialState,
  reducers: { 
    setOpen: (state, { payload }) => {
      state.open = payload;
    },
    setText: (state, { payload }) => {
      state.text = payload;
    },
  },
});

export const { setText, setOpen } = search.actions;
export default search.reducer;
