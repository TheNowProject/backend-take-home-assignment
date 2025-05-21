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
      return ctx.db.connection().execute(async (conn) => {
        const result = await conn
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

        const { mutualFriendCount: count } = await mutualFriendCount(
          conn,
          ctx.session.userId,
          input.friendUserId
        )

        return z
          .object({
            id: IdSchema,
            fullName: NonEmptyStringSchema,
            phoneNumber: NonEmptyStringSchema,
            totalFriendCount: CountSchema,
            mutualFriendCount: CountSchema,
          })
          .parse({
            ...result,
            mutualFriendCount: Number(count),
          })
      })
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

const mutualFriendCount = (db: Database, userId1: number, userId2: number) => {
  return db
    .selectFrom('friendships as f1')
    .innerJoin('friendships as f2', (join) =>
      join
        .onRef('f1.friendUserId', '=', 'f2.friendUserId') //take the same friend
        .on('f1.status', '=', FriendshipStatusSchema.Values['accepted'])
        .on('f2.status', '=', FriendshipStatusSchema.Values['accepted'])
    )
    .where('f1.userId', '=', userId1)
    .where('f2.userId', '=', userId2)
    .select((eb) => eb.fn.count('f1.friendUserId').as('mutualFriendCount'))
    .executeTakeFirstOrThrow()
}
