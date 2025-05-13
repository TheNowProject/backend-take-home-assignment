import type { Database } from '@/server/db'

import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { FriendshipStatusSchema } from '@/utils/server/friendship-schemas'
import { protectedProcedure } from '@/server/trpc/procedures'
import { router } from '@/server/trpc/router'
import {
  NonEmptyStringSchema,
  CountSchema,
  IdSchema,
} from '@/utils/server/base-schemas'

export const myFriendRouter = router({
  getById: protectedProcedure
    .input(
      z.object({
        friendUserId: IdSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      /**
       * Question 4: Implement mutual friend count
       *
       * Add `mutualFriendCount` to the returned result of this query. You can
       * either:
       *  (1) Make a separate query to count the number of mutual friends,
       *  then combine the result with this query
       *  (2) BONUS: Use a subquery (hint: take a look at how
       *  `totalFriendCount` is implemented)
       *
       * Instructions:
       *  - Go to src/server/tests/friendship-request.test.ts, enable the test
       * scenario for Question 3
       *  - Run `yarn test` to verify your answer
       *
       * Documentation references:
       *  - https://kysely-org.github.io/kysely/classes/SelectQueryBuilder.html#innerJoin
       */

      // First, get the friend data without mutual friend count
      const friend = await ctx.db.connection().execute(async (conn) =>
        conn
          .selectFrom('users as friends')
          .innerJoin('friendships', 'friendships.friendUserId', 'friends.id')
          .innerJoin(
            userTotalFriendCount(conn).as('userTotalFriendCount'),
            'userTotalFriendCount.userId',
            'friends.id'
          )
          .where('friendships.userId', '=', ctx.session.userId)
          .where('friendships.friendUserId', '=', input.friendUserId)
          .where(
            'friendships.status',
            '=',
            FriendshipStatusSchema.Values['accepted']
          )
          .select([
            'friends.id',
            'friends.fullName',
            'friends.phoneNumber',
            'totalFriendCount',
          ])
          .executeTakeFirstOrThrow(() => new TRPCError({ code: 'NOT_FOUND' }))
      )

      // Then, calculate mutual friend count separately
      const mutualFriendResult = await ctx.db
        .connection()
        .execute(async (conn) => {
          // Get friends of current user
          const myFriends = conn
            .selectFrom('friendships as f1')
            .where('f1.userId', '=', ctx.session.userId)
            .where('f1.status', '=', FriendshipStatusSchema.Values['accepted'])
            .select('f1.friendUserId')

          // Count mutual friends (friends of target user that are also friends of current user)
          return conn
            .selectFrom('friendships as f2')
            .where('f2.userId', '=', input.friendUserId)
            .where('f2.status', '=', FriendshipStatusSchema.Values['accepted'])
            .where('f2.friendUserId', 'in', myFriends)
            .select((eb) => [
              eb.fn.count('f2.friendUserId').as('mutualFriendCount'),
            ])
            .executeTakeFirst()
        })

      // Combine the results and parse with Zod schema
      const result = {
        ...friend,
        mutualFriendCount: mutualFriendResult?.mutualFriendCount ?? 0,
      }

      return z
        .object({
          id: IdSchema,
          fullName: NonEmptyStringSchema,
          phoneNumber: NonEmptyStringSchema,
          totalFriendCount: CountSchema,
          mutualFriendCount: CountSchema,
        })
        .parse(result)
    }),
})

const userTotalFriendCount = (db: Database) => {
  return db
    .selectFrom('friendships')
    .where('friendships.status', '=', FriendshipStatusSchema.Values['accepted'])
    .select((eb) => [
      'friendships.userId',
      eb.fn.count('friendships.friendUserId').as('totalFriendCount'),
    ])
    .groupBy('friendships.userId')
}
