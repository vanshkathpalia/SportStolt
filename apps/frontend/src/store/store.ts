import { configureStore } from "@reduxjs/toolkit"
import notificationReducer from "../features/notificationSlice"

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
  },
})

// TypeScript types for store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
