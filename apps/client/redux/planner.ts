import { createSlice } from "@reduxjs/toolkit";
import DegreePlan from "@typedefs/DegreePlan";
export interface PlannerState{
    plan: DegreePlan
}

const initialState: PlannerState = {
  plan: {
    name: "",
    semesters: [],
    department: "",
    
  } as DegreePlan,
};

const plan = createSlice({
  name: "planner",
  initialState, 
  reducers: {
    // Payload is expected to be only the semester id that belongs to the semester to remove from the list.
    setPlannedSemesters: (state, {payload} ) => {
      state.plan.semesters = payload;
    },
  },
});

export const { setPlannedSemesters } = plan.actions;

export default plan.reducer;
