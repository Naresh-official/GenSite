import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "./features/inputSlice";
import filesReducer from "./features/filesSlice";

export const store = configureStore({
	reducer: {
		input: inputReducer,
		files: filesReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
