import { router } from '../trpc/router'

import { myOutgoingFriendshipRequestRouter } from './routers/my-outgoing-friendship-request-router'
import { friendshipRequestRouter } from './routers/friendship-request-router'
import { myFriendRouter } from './routers/my-friend-router'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  friendshipRequest: friendshipRequestRouter,
  myFriend: myFriendRouter,
  myOutGoingFriendshipRequest: myOutgoingFriendshipRequestRouter,
})

export type AppRouter = typeof appRouter
