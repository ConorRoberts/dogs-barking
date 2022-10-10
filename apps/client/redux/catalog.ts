import { createSlice } from "@reduxjs/toolkit";

export interface CatalogState {
  type: "courses" | "programs";

  filters: [string, string | number][];

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
  filters: [],
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
      state.filters = [];
    },
    addFilter: (state, { payload }) => {
      state.filters = [...state.filters, payload];
    },
    removeFilter: (state, { payload }) => {
      state.filters = state.filters.filter((filter) => filter[0] !== payload[0]);
    },
  },
});

export const { setFilters, setPageState, setCatalogType, resetFilters, addFilter, removeFilter } = catalog.actions;
export default catalog.reducer;
