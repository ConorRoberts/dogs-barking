import { configureStore } from "@reduxjs/toolkit";
import planner from "./planner";
import catalog from "./catalog";
import search from "./search";

const store = configureStore({
  reducer: { planner, catalog, search },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
