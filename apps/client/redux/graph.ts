import { createSlice } from "@reduxjs/toolkit";
import { Node } from "react-flow-renderer";

export interface GraphState {
    selectedNode: Node | null;
}
const initialState: GraphState = {
  selectedNode: null,
};

const graph = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setSelectedNode: (state, { payload }) => {
      state.selectedNode = payload;
    },
  },
});

export const { setSelectedNode } = graph.actions;

export default graph.reducer;
