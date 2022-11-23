import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: 0,
  email: "",
  role: "",
  is_verified: Boolean,
  // is_loading: false
  // first_name: "",
  // last_name: ""
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id
      state.email = action.payload.email
      state.role = action.payload.role
      state.is_verified = action.payload.is_verified
      // state.is_loading = false
      // console.log(action.payload)
      // state.first_name = action.payload.first_name
      // state.last_name = action.payload.last_name
    },
    logout: (state) => {
      state.id = 0
      state.email = ""
      state.role = ""
      // state.first_name = ""
      // state.last_name = ""
    },
    // login_request: (state) => {
    //   state.is_loading = true
    // },
    // login_failed: state => state.is_loading = false
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
