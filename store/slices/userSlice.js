import { createSlice } from "@reduxjs/toolkit";

const userState = { users: [] };

const userSlice = createSlice({
    name: "user",
    initialState: userState,
    reducers: {
        addUser: (state, action) => {
            state.users=[...state.user,action.payload];
        },
        deleteuser: (state, action) => {
            state.user = state.users.filter(
                (u) => u._id !== action.payload
            );
        },
    },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
