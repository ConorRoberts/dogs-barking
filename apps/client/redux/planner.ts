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
    warnings: [],
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
    // Payload is expected to be a single string that represents the name of the current plan.
    setPlanName: (state, {payload} ) => {
      state.plan.name = payload;
    },
    // Payload is expected to be a single string that represents the name of the department associated with the plan.
    setDepartment: (state, {payload} ) => {
      state.plan.department = payload;
    },
    // Payload is expected to be a single array of strings that describe different warnings about the plan.
    setWarnings: (state, { payload }) => { 
      state.plan.warnings = payload;
    },
  },
});

export const { setPlannedSemesters, setPlanName, setDepartment, setWarnings } = plan.actions;

export default plan.reducer;
