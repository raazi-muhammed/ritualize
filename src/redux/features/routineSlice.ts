import { Routine, Task } from "@/types/entities";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { routines: Routine[] } = {
    routines: [
        {
            name: "MorningRoutine",
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
        deleteRoutine(state, action: PayloadAction<string>) {
            state.routines = state.routines.filter(
                (routine) => routine.name != action.payload
            );
            return state;
        },

        addTask(state, action: PayloadAction<{ routine: string; task: Task }>) {
            state.routines.map((routine) => {
                if (routine.name === action.payload.routine) {
                    routine.tasks.push(action.payload.task);
                }
            });
        },
        deleteTask(
            state,
            action: PayloadAction<{ routine: string; index: number }>
        ) {
            state.routines.map((routine) => {
                if (routine.name === action.payload.routine) {
                    routine.tasks.splice(
                        action.payload.index,
                        action.payload.index + 1
                    );
                }
            });
        },
    },
});

export const { addRoutine, addTask, deleteTask, deleteRoutine } =
    routineSlice.actions;

export default routineSlice.reducer;
