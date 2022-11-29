import { configureStore } from "@reduxjs/toolkit"

import authSlice from "./features/authSlice"
import propSlice from "./features/propSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tenant: propSlice,
  },
})
