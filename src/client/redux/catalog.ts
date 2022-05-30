import { createSlice } from "@reduxjs/toolkit";

export interface CatalogState {
  // Filter Data
  filters: {
    courseId?: string;
    school?: string;
    number?: number;
    description?: string;
    prerequisites?: string[];
    department?: string;
    name?: string;
    weight?: number;
    degree?: string;
    programId?: string;
  };

  type: "courses" | "programs";

  scope: "all" | "undergrad" | "grad";

  // Data of the catalog page
  pageState: {
    pageNum: number;
    pageSize: number;
    sortDir?: "asc" | "desc";
    sortKey?: string;
  };
}

const initialState: CatalogState = {
  pageState: {
    pageNum: 0,
    pageSize: 50,
    sortDir: "desc",
    sortKey: "courseCode",
  },
  scope: "all",
  filters: {},
  type: "courses",
};

const catalog = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPageState: (state, action) => {
      state.pageState = { ...state.pageState, ...action.payload };
    },
    setCatalogType: (state, action) => {
      state.type = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {};
    },
    setScope: (state, { payload }) => {
      state.scope = payload;
    },
  },
});

export const { setFilters, setPageState, setCatalogType, resetFilters, setScope } = catalog.actions;
export default catalog.reducer;
