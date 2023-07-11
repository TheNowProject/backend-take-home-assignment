import { faker } from '@faker-js/faker/locale/vi'

import { createInnerTRPCContext } from '../trpc/base'
import { appRouter } from '../api/root'
import { db } from '../db'

export const createUser = async () => {
  const fullName = faker.person.fullName()
  const phoneNumber = faker.phone.number('+84#########')

  await db
    .insertInto('users')
    .values({
      fullName,
      phoneNumber,
    })
    .execute()

  const { id: userId } = await db
    .selectFrom('users')
    .where('users.phoneNumber', '=', phoneNumber)
    .where('users.fullName', '=', fullName)
    .select('users.id')
    .executeTakeFirstOrThrow(() => new Error('Cannot create user'))

  const context = createInnerTRPCContext({
    session: {
      userId,
    },
  })

  const caller = appRouter.createCaller(context)

  return {
    id: userId,
    fullName,
    phoneNumber,
    sendFriendshipRequest: caller.friendshipRequest.send,
    acceptFriendshipRequest: caller.friendshipRequest.accept,
    declineFriendshipRequest: caller.friendshipRequest.decline,
    getFriendById: caller.myFriend.getById,
    getMyOutgoingFriendshipRequests: caller.myOutGoingFriendshipRequest.getAll,
  }
}
