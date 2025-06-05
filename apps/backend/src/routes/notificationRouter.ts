// src/routes/notificationRouter.ts
import { Hono } from 'hono'
import { authMiddleware } from '../middleware/authMiddleware'
import {
  getNotifications,
  sendNotificationController,
  verifyNotificationController,
  getEventNotifications,
  // sendEventNotification 
} from '../controllers/notificationController'

export const notificationRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    userId: number
  }
}>()

notificationRouter.use('*', authMiddleware)

notificationRouter.get('/all', getNotifications)
notificationRouter.post('/send-all', sendNotificationController)
notificationRouter.post('/verify', verifyNotificationController)
notificationRouter.get('/event', getEventNotifications);
// notificationRouter.post('/send-event', sendEventNotification) // calling it from creteEventHandler

// export default notificationRouter