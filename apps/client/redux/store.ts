import { configureStore } from "@reduxjs/toolkit";
import graph from "./graph";
import auth from "./auth";
import planner from "./planner";
import catalog from "./catalog";

const store = configureStore({
  reducer: { graph, auth, planner, catalog},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
