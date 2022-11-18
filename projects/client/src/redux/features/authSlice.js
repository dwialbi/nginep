import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    id: 0,
    email: "",
    first_name: "",
    last_name: ""
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.id = action.payload.id
            state.email = action.payload.email
            // state.first_name = action.payload.first_name
            // state.last_name = action.payload.last_name
        },
        logout: (state) => {
            state.id = 0
            state.email = ""
            // state.first_name = ""
            // state.last_name = ""
        }
    },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer 