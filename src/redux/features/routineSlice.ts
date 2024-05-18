import { Routine, Task } from "@/types/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { routines: Routine[] } = {
    routines: [
        {
            name: "Morning routine",
            duration: 10,
            cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Morning%2C_just_after_sunrise%2C_Namibia.jpg/1200px-Morning%2C_just_after_sunrise%2C_Namibia.jpg",
            tasks: [
                {
                    name: "Meditate",
                    duration: 2,
                },
                {
                    name: "Yoga",
                    duration: 5,
                },
            ],
        },
    ],
};

const routineSlice = createSlice({
    name: "routine",
    initialState,
    reducers: {
        addRoutine(state, action: PayloadAction<Routine>) {
            state.routines.push(action.payload);
        },
        addTask(state, action: PayloadAction<{ routine: string; task: Task }>) {
            state.routines.map((routine) => {
                if (routine.name === action.payload.routine) {
                    routine.tasks.push(action.payload.task);
                }
            });
        },
    },
});

export const { addRoutine, addTask } = routineSlice.actions;

export default routineSlice.reducer;
