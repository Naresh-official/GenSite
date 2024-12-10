import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
	value: string;
}

const initialState: CounterState = {
	value: "",
};

export const inputSlice = createSlice({
	name: "input",
	initialState,
	reducers: {
		setInput: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
		},
	},
});

export const { setInput } = inputSlice.actions;

export default inputSlice.reducer;
