// src/store/features/filesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFile } from "@/types";

interface FilesState {
	files: IFile[];
}

const initialState: FilesState = {
	files: [],
};

const filesSlice = createSlice({
	name: "files",
	initialState,
	reducers: {
		setFiles(state, action: PayloadAction<IFile[]>) {
			state.files = action.payload; // Ensure this line updates the state
		},
	},
});

export const { setFiles } = filesSlice.actions;
export default filesSlice.reducer;
