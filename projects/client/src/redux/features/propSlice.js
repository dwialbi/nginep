import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: 0,
  name: "",
  address: "",
  description: "",
  image_url: "",
}

const propSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    details: (state, action) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.address = action.payload.address
      state.description = action.payload.description
      state.image_url = action.payload.image_url
      console.log(action.payload)
    },
  },
})

export const { details } = propSlice.actions

export default propSlice.reducer
