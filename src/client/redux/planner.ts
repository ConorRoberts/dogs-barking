import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

export interface PlannerState {
  semesters: string[];
}
const initialState: PlannerState = {
  semesters: [],
};

const planner = createSlice({
  name: "plannerSlice",
  initialState,
  reducers: {
    setSemesters: (state, { payload }) => {
      state.semesters = payload;
    },
  },
});

const plannerStore = configureStore({
  reducer: { planner: planner.reducer },
});

export type AppDispatch = typeof plannerStore.dispatch;
export const { setSemesters } = planner.actions;

export default plannerStore;
