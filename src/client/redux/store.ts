import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";
import planner from "./planner";

const store = configureStore({
  reducer: { auth, planner },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
