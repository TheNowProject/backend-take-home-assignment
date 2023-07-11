import { z } from 'zod'

import { IdSchema, NonEmptyStringSchema } from '@/utils/server/base-schemas'
import { FriendshipStatusSchema } from '@/utils/server/friendship-schemas'
import { protectedProcedure } from '@/server/trpc/procedures'
import { router } from '@/server/trpc/router'

export const myOutgoingFriendshipRequestRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .selectFrom('friendships')
      .innerJoin('users as friends', 'friends.id', 'friendships.friendUserId')
      .where('userId', '=', ctx.session.userId)
      .select([
        'friendships.friendUserId',
        'friendships.status',
        'friends.fullName',
      ])
      .execute()
      .then(
        z.array(
          z.object({
            friendUserId: IdSchema,
            fullName: NonEmptyStringSchema,
            status: FriendshipStatusSchema,
          })
        ).parse
      )
  }),
})
