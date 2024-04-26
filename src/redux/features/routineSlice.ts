import { IRoutine } from "@/types/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { routines: IRoutine[] } = {
    routines: [{ name: "Morning routine", duration: 10 }],
};

const routineSlice = createSlice({
    name: "routine",
    initialState,
    reducers: {
        addRoutine(state, action: PayloadAction<IRoutine>) {
            state.routines.push(action.payload);
        },
    },
});

export const { addRoutine } = routineSlice.actions;

export default routineSlice.reducer;
