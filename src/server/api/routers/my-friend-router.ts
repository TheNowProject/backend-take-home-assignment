// import type { DB } from '@/server/db/types'
// import type { Database } from '@/server/db'
// import type { OperandValueExpressionOrList } from 'kysely'

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
      return ctx.db.connection().execute(async (conn) =>
        /**
         * Question 4: Implement mutual friend count
         *
         * Add `mutualFriendCount` to the returned result of this query. You can
         * either:
         *  (1) Make a separate query to count the number of mutual friends,
         *  then combine the result with the result of this query
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
        //   conn
        //     .with('userMutualFriendCount', (db) =>
        //       db
        //         .selectFrom('friendships as f1')
        //         .innerJoin(
        //           'friendships as f2',
        //           'f1.friendUserId',
        //           'f2.friendUserId'
        //         )
        //         .where('f1.userId', '=', input.friendUserId)
        //         .where('f2.userId', '=', ctx.session.userId)
        //         .where(
        //           'f1.status',
        //           '=',
        //           FriendshipStatusSchema.Values['accepted']
        //         )
        //         .where(
        //           'f2.status',
        //           '=',
        //           FriendshipStatusSchema.Values['accepted']
        //         )
        //         .select((eb) => [
        //           eb.val(input.friendUserId).as('userId'),
        //           eb.fn.count('f1.friendUserId').as('mutualFriendCount'),
        //         ])
        //     )
        //     .selectFrom('users as friends')
        //     .innerJoin('friendships', 'friendships.friendUserId', 'friends.id')
        //     .innerJoin(
        //       userTotalFriendCount(conn).as('userTotalFriendCount'),
        //       'userTotalFriendCount.userId',
        //       'friends.id'
        //     )
        //     .innerJoin(
        //       'userMutualFriendCount',
        //       'userMutualFriendCount.userId',
        //       'friends.id'
        //     )
        //     .where('friendships.userId', '=', ctx.session.userId)
        //     .where('friendships.friendUserId', '=', input.friendUserId)
        //     .where(
        //       'friendships.status',
        //       '=',
        //       FriendshipStatusSchema.Values['accepted']
        //     )
        //     .select([
        //       'friends.id',
        //       'friends.fullName',
        //       'friends.phoneNumber',
        //       'totalFriendCount',
        //       'mutualFriendCount',
        //     ])
        //     .executeTakeFirstOrThrow(() => new TRPCError({ code: 'NOT_FOUND' }))
        //     .then(
        //       z.object({
        //         id: IdSchema,
        //         fullName: NonEmptyStringSchema,
        //         phoneNumber: NonEmptyStringSchema,
        //         totalFriendCount: CountSchema,
        //         mutualFriendCount: CountSchema,
        //       }).parse
        //     )
        conn
          .with('friendDetail', (db) =>
            db
              .selectFrom('users')
              .where('users.id', '=', input.friendUserId)
              .selectAll()
          )
          .with('friendsOfMe', (db) =>
            db
              .selectFrom('friendships')
              .where('friendships.userId', '=', ctx.session.userId)
              .where(
                'friendships.status',
                '=',
                FriendshipStatusSchema.Values['accepted']
              )
              .select(['userId', 'friendUserId'])
          )
          .with('friendsOfMyFriend', (db) =>
            db
              .selectFrom('friendships')
              .where('friendships.userId', '=', input.friendUserId)
              .where(
                'friendships.status',
                '=',
                FriendshipStatusSchema.Values['accepted']
              )
              .select(['id', 'userId', 'friendUserId'])
          )
          .with('totalFriends', (db) =>
            db
              .selectFrom('friendsOfMyFriend')
              .select((eb) => [
                'userId',
                eb.fn
                  .count('friendsOfMyFriend.friendUserId')
                  .as('totalFriendCount'),
              ])
          )
          .with('mutualFriends', (db) =>
            db
              .selectFrom('friendsOfMyFriend as f1')
              .innerJoin(
                'friendsOfMe as f2',
                'f1.friendUserId',
                'f2.friendUserId'
              )
              .select((eb) => [
                'f1.userId',
                eb.fn.count('f1.friendUserId').as('mutualFriendCount'),
              ])
          )
          .selectFrom('friendDetail')
          .innerJoin('totalFriends', 'friendDetail.id', 'totalFriends.userId')
          .leftJoin('mutualFriends', 'friendDetail.id', 'mutualFriends.userId')
          .select([
            'id',
            'fullName',
            'phoneNumber',
            'totalFriends.totalFriendCount',
            'mutualFriends.mutualFriendCount',
          ])
          .executeTakeFirstOrThrow(() => new TRPCError({ code: 'NOT_FOUND' }))
          .then(
            z.object({
              id: IdSchema,
              fullName: NonEmptyStringSchema,
              phoneNumber: NonEmptyStringSchema,
              totalFriendCount: CountSchema,
              mutualFriendCount: CountSchema,
            }).parse
          )
      )
    }),
})

// const userTotalFriendCount = (db: Database) => {
//   return db
//     .selectFrom('friendships')
//     .where('friendships.status', '=', FriendshipStatusSchema.Values['accepted'])
//     .select((eb) => [
//       'friendships.userId',
//       eb.fn.count('friendships.friendUserId').as('totalFriendCount'),
//     ])
//     .groupBy('friendships.userId')
// }

// const userMutualFriendCount = (
//   db: Database,
//   userAId: OperandValueExpressionOrList<
//     DB,
//     'friendships',
//     'friendships.userId'
//   >,
//   userBId: OperandValueExpressionOrList<DB, 'friendships', 'friendships.userId'>
// ) => {
//   return db
//     .selectFrom('friendships as f1')
//     .innerJoin('friendships as f2', 'f1.friendUserId', 'f2.friendUserId')
//     .where('f1.userId', '=', userAId)
//     .where('f2.userId', '=', userBId)
//     .where('f1.status', '=', FriendshipStatusSchema.Values['accepted'])
//     .where('f2.status', '=', FriendshipStatusSchema.Values['accepted'])
//     .select((eb) => [
//       eb.val(userBId).as('userId'),
//       eb.fn.count('f1.friendUserId').as('mutualFriendCount'),
//     ])
// }
