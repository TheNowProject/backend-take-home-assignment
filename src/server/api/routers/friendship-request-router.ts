import type { Transaction } from 'kysely'
import type { DB } from '@/server/db/types'

import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { FriendshipStatusSchema } from '@/utils/server/friendship-schemas'
import { IdSchema } from '@/utils/server/base-schemas'
import { authGuard } from '@/server/trpc/middlewares/auth-guard'
import { procedure } from '@/server/trpc/procedures'
import { router } from '@/server/trpc/router'

const SendFriendshipRequestInputSchema = z.object({
  friendUserId: IdSchema,
})

const canSendFriendshipRequest = authGuard.unstable_pipe(
  async ({ ctx, rawInput, next }) => {
    const { friendUserId } = SendFriendshipRequestInputSchema.parse(rawInput)

    await ctx.db
      .selectFrom('users')
      .where('users.id', '=', friendUserId)
      .select('id')
      .limit(1)
      .executeTakeFirstOrThrow(
        () =>
          new TRPCError({
            code: 'BAD_REQUEST',
          })
      )

    return next({ ctx })
  }
)

const AnswerFriendshipRequestInputSchema = z.object({
  friendUserId: IdSchema,
})

const canAnswerFriendshipRequest = authGuard.unstable_pipe(
  async ({ ctx, rawInput, next }) => {
    const { friendUserId } = AnswerFriendshipRequestInputSchema.parse(rawInput)

    await ctx.db
      .selectFrom('friendships')
      .where('friendships.userId', '=', friendUserId)
      .where('friendships.friendUserId', '=', ctx.session.userId)
      .where(
        'friendships.status',
        '=',
        FriendshipStatusSchema.Values['requested']
      )
      .select('friendships.id')
      .limit(1)
      .executeTakeFirstOrThrow(() => {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        })
      })

    return next({ ctx })
  }
)

export const friendshipRequestRouter = router({
  send: procedure
    .use(canSendFriendshipRequest)
    .input(SendFriendshipRequestInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { friendUserId } = input
      const userId = ctx.session.userId
      await ctx.db.transaction().execute(async (t) => {
        //if A send friendShip request to B, no matter what status the friendship is,
        // update the status to requested
        await upsertFriendship(
          t,
          userId,
          friendUserId,
          FriendshipStatusSchema.Values['requested']
        )
        await upsertFriendship(
          t,
          friendUserId,
          userId,
          FriendshipStatusSchema.Values['requested']
        )
      })
    }),

  accept: procedure
    .use(canAnswerFriendshipRequest)
    .input(AnswerFriendshipRequestInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { friendUserId } = input
      const userId = ctx.session.userId
      //accept = both friendShip and reverse friendship status are updated to accepted
      await ctx.db.transaction().execute(async (t) => {
        await upsertFriendship(
          t,
          userId,
          friendUserId,
          FriendshipStatusSchema.Values['accepted']
        )
        await upsertFriendship(
          t,
          friendUserId,
          userId,
          FriendshipStatusSchema.Values['accepted']
        )
      })
    }),

  decline: procedure
    .use(canAnswerFriendshipRequest)
    .input(AnswerFriendshipRequestInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { friendUserId } = input
      const userId = ctx.session.userId
      //if one of the user declines the friendship request, update both friendship status to declined
      await ctx.db.transaction().execute(async (t) => {
        await upsertFriendship(
          t,
          userId,
          friendUserId,
          FriendshipStatusSchema.Values['declined']
        )
        await upsertFriendship(
          t,
          friendUserId,
          userId,
          FriendshipStatusSchema.Values['declined']
        )
      })
    }),
})

//since I am not allowed to create a new file, I will add all util functions here

async function upsertFriendship(
  query: Transaction<DB>,
  userId: number,
  friendUserId: number,
  status: string
): Promise<void> {
  //check if friendship between userId and friendUserId is already exists
  const friendship = await query
    .selectFrom('friendships')
    .select('id')
    .where('friendships.userId', '=', userId)
    .where('friendships.friendUserId', '=', friendUserId)
    .executeTakeFirst()
  //if friendship is not exists, create a new one with corresponding status
  if (!friendship) {
    await query
      .insertInto('friendships')
      .values({
        userId,
        friendUserId,
        status,
      })
      .execute()
  } else {
    //if friendship is exists, update the status
    await query
      .updateTable('friendships')
      .set({ status })
      .where('friendships.userId', '=', userId)
      .where('friendships.friendUserId', '=', friendUserId)
      .execute()
  }
}
