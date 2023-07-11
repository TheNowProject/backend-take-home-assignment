import { z } from 'zod'

export const FriendshipStatusSchema = z.enum([
  'requested',
  'accepted',
  'declined',
])

export type FriendshipStatus = z.infer<typeof FriendshipStatusSchema>
