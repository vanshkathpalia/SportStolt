import type { AcceleratedPrismaClient } from '../lib/prismaClient'

export async function sendNotification({
  prisma,
  type,
  senderId,
  receiverId,
  message,
  postId,
  scheduledAt,
  eventId
}: {
  prisma: AcceleratedPrismaClient
  type: "LIKE" | "COMMENT" | "FOLLOW" | "STORY_ATTENDANCE" | "VERIFICATION" | "INFO" | "SYSTEM"
  senderId: number
  receiverId: number
  message: string
  postId?: number
  scheduledAt?: Date
  eventId?: number
}) {
  return prisma.notification.create({
    data: {
      type,
      senderId,
      receiverId,
      message,
      postId,
      scheduledAt,
      eventId,
      seen: false
    }
  })
}
