import { createSlice } from "@reduxjs/toolkit";
import DegreePlan from "@typedefs/DegreePlan";

export interface CatalogState {
    // Filter Data
    filters: {
        courseId?: string;
        school?: string;
        number?: number;
        description?: string;
        prerequisites?: string[];
        department?: string;
        sortDir?: "asc" | "desc";
        sortKey?: string;
        name?: string;
        weight?: number;
        degree?: string;
    };

    // Data of the catalog page
    pageState: {
        pageNum: number;
        pageSize: number;
        totalPages: number;
        useFilter: boolean;
    };
    updatePage: {
      update: boolean;
    };
}

const initialState: CatalogState = {
  filters : {
    courseId: "",
    school: "",
    number: null,
    description: "",
    prerequisites: [],
    department: "",
    sortDir: "asc",
    sortKey: "id",
    name: "",
    weight: null,
    degree: "",
  },
  pageState: {
    pageNum: 0,
    pageSize: 50,
    totalPages: 127,
    useFilter: false
  },
  updatePage: {
    update: false
  },
};

const filters = createSlice({
  name: "catalog",
  initialState, 
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...action.payload
      };
    },
    setPageState: (state, action) => {
      state.pageState = action.payload;
    },
    setUpdatePage: (state, action) => {
      state.updatePage = {
        ...action.payload
      };
    },
  },
});

export const {setFilters, setPageState, setUpdatePage } = filters.actions;

export default filters.reducer;
