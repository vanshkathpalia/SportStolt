import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Notification {
  id: number
  type: string
  content: string
  isVerified?: boolean
}

interface NotificationState {
  list: Notification[]
}

const initialState: NotificationState = {
  list: [],
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.list = action.payload
    },
    updateVerification: (state, action: PayloadAction<{ id: number; isVerified: boolean }>) => {
      const notification = state.list.find((n) => n.id === action.payload.id)
      if (notification) {
        notification.isVerified = action.payload.isVerified
      }
    },
  },
})

export const { setNotifications, updateVerification } = notificationSlice.actions
export default notificationSlice.reducer
