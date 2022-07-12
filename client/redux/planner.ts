import { createSlice } from "@reduxjs/toolkit";
import DegreePlanData from "@typedefs/DegreePlan";

export interface PlannerState {
  semesters: string[];
  plan: DegreePlanData | null;
  currentEditingSemester: string | null;
}
const initialState: PlannerState = {
  semesters: [],
  plan: null,
  currentEditingSemester: null,
};

const planner = createSlice({
  name: "plannerSlice",
  initialState,
  reducers: {
    setSemesters: (state, { payload }) => {
      state.semesters = payload;
    },
    setPlan: (state, { payload }) => {
      state.plan = payload;
    },
    setCurrentEditingSemester: (state, { payload }) => {
      state.currentEditingSemester = payload;
    },
  },
});

export const { setSemesters, setPlan, setCurrentEditingSemester } = planner.actions;
export default planner.reducer;
