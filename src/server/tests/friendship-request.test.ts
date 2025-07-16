import { describe, test } from 'vitest'

import { FriendshipStatusSchema } from '@/utils/server/friendship-schemas'

import { createUser } from './utils'

describe.concurrent('Friendship request', async () => {
  /**
   * Scenario:
   *  1. User A sends a friendship request to user B
   *  2. User B accepts the friendship request
   */
  test('Question 1 / Scenario 1', async ({ expect }) => {
    const [userA, userB] = await Promise.all([createUser(), createUser()])

    await userA.sendFriendshipRequest({
      friendUserId: userB.id,
    })

    const startTime = Date.now()
    await userB.acceptFriendshipRequest({
      friendUserId: userA.id,
    })
    // eslint-disable-next-line no-console
    console.log(
      `Time taken for Question 1 (Accept friendship request) - Scenario 1: ${
        Date.now() - startTime
      }ms`
    )

    await expect(
      userA.getFriendById({ friendUserId: userB.id })
    ).resolves.toEqual(
      expect.objectContaining({
        id: userB.id,
      })
    )

    await expect(
      userB.getFriendById({ friendUserId: userA.id })
    ).resolves.toEqual(
      expect.objectContaining({
        id: userA.id,
      })
    )
  })

  /**
   * Scenario:
   *  1. User A sends a friendship request to user B
   *  2. User B sends a friendship request to user A
   *  3. User A accepts the friendship request
   */
  test('Question 1 / Scenario 2', async ({ expect }) => {
    const [userA, userB] = await Promise.all([createUser(), createUser()])

    await userA.sendFriendshipRequest({
      friendUserId: userB.id,
    })

    await userB.sendFriendshipRequest({
      friendUserId: userA.id,
    })

    const startTime = Date.now()
    await userA.acceptFriendshipRequest({
      friendUserId: userB.id,
    })
    // eslint-disable-next-line no-console
    console.log(
      `Time taken for Question 1 (Accept friendship request) - Scenario 2: ${
        Date.now() - startTime
      }ms`
    )

    await expect(
      userA.getFriendById({ friendUserId: userB.id })
    ).resolves.toEqual(
      expect.objectContaining({
        id: userB.id,
      })
    )

    await expect(
      userB.getFriendById({ friendUserId: userA.id })
    ).resolves.toEqual(
      expect.objectContaining({
        id: userA.id,
      })
    )
  })

  /**
   * Scenario:
   *  1. User A sends a friendship request to user B
   *  2. User B declines the friendship request
   */
  test('Question 2 / Scenario 1', async ({ expect }) => {
    const [userA, userB] = await Promise.all([createUser(), createUser()])

    await expect(
      userA.sendFriendshipRequest({
        friendUserId: userB.id,
      })
    ).resolves.not.toThrow()

    await expect(
      userA.getMyOutgoingFriendshipRequests()
    ).resolves.toContainEqual(
      expect.objectContaining({
        friendUserId: userB.id,
        status: FriendshipStatusSchema.Values['requested'],
      })
    )

    const startTime = Date.now()
    await userB.declineFriendshipRequest({
      friendUserId: userA.id,
    })
    //eslint-disable-next-line no-console
    console.log(
      `Time taken for Question 2 (Decline friendship request) - Scenario 1: ${
        Date.now() - startTime
      }ms`
    )

    await expect(
      userA.getMyOutgoingFriendshipRequests()
    ).resolves.toContainEqual(
      expect.objectContaining({
        friendUserId: userB.id,
        status: FriendshipStatusSchema.Values['declined'],
      })
    )
  })

  /**
   * Scenario:
   *  1. User A sends a friendship request to user B
   */
  test('Question 3 / Scenario 1', async ({ expect }) => {
    const [userA, userB] = await Promise.all([createUser(), createUser()])

    const startTime = Date.now()
    await expect(
      userA.sendFriendshipRequest({
        friendUserId: userB.id,
      })
    ).resolves.not.toThrow()
    //eslint-disable-next-line no-console
    console.log(
      `Time taken for Question 3 (Fix bug) - Scenario 1: ${
        Date.now() - startTime
      }ms`
    )

    await expect(
      userA.getMyOutgoingFriendshipRequests()
    ).resolves.toContainEqual(
      expect.objectContaining({
        friendUserId: userB.id,
        status: FriendshipStatusSchema.Values['requested'],
      })
    )
  })

  /**
   * Scenario:
   *  1. User A sends a friendship request to user B
   *  2. User B declines the request
   *  3. User A re-sends a new friendship request to user B
   */
  test('Question 3 / Scenario 2', async ({ expect }) => {
    const [userA, userB] = await Promise.all([createUser(), createUser()])

    await userA.sendFriendshipRequest({
      friendUserId: userB.id,
    })

    await userB.declineFriendshipRequest({
      friendUserId: userA.id,
    })

    const startTime = Date.now()
    await userA.sendFriendshipRequest({
      friendUserId: userB.id,
    })
    //eslint-disable-next-line no-console
    console.log(
      `Time taken for Question 3 (Fix bug) - Scenario 2: ${
        Date.now() - startTime
      }ms`
    )

    await expect(
      userA.getMyOutgoingFriendshipRequests()
    ).resolves.toContainEqual(
      expect.objectContaining({
        friendUserId: userB.id,
        status: FriendshipStatusSchema.Values['requested'],
      })
    )
  })

  /**
   * Scenario:
   *  1. User B, C, D, E send friendship requests to user A
   *  2. User A accepts all the requests
   *
   *  -> User A should have a total of 4 friends
   */
  test('Question 4 / Scenario 1', async ({ expect }) => {
    const [userA, userB, userC, userD, userE] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
      createUser(),
      createUser(),
    ])

    await Promise.all([
      userB.sendFriendshipRequest({
        friendUserId: userA.id,
      }),
      userC.sendFriendshipRequest({
        friendUserId: userA.id,
      }),
      userD.sendFriendshipRequest({
        friendUserId: userA.id,
      }),
      userE.sendFriendshipRequest({
        friendUserId: userA.id,
      }),
    ])

    await Promise.all([
      userA.acceptFriendshipRequest({
        friendUserId: userB.id,
      }),
      userA.acceptFriendshipRequest({
        friendUserId: userC.id,
      }),
      userA.acceptFriendshipRequest({
        friendUserId: userD.id,
      }),
      userA.acceptFriendshipRequest({
        friendUserId: userE.id,
      }),
    ])
    const startTime = Date.now()
    await expect(
      userB.getFriendById({
        friendUserId: userA.id,
      })
    ).resolves.toEqual(
      expect.objectContaining({
        id: userA.id,
        totalFriendCount: 4,
      })
    )
    // eslint-disable-next-line no-console
    console.log(
      `Time taken for Question 4 (Count mutual friends) - Scenario 1: ${
        Date.now() - startTime
      }ms`
    )
  })

  /**
   * Scenario:
   *  1. User B, C, D, E send friendship requests to user A
   *  2. User C sends a friendship request to user B
   *  3. User A accepts all the requests
   *  4. User B accepts user C's request
   *
   *  -> User A should have 1 mutual friend with user B
   */
  test('Question 4 / Scenario 2', async ({ expect }) => {
    const [userA, userB, userC, userD, userE] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
      createUser(),
      createUser(),
    ])

    await Promise.all([
      userB.sendFriendshipRequest({
        friendUserId: userA.id,
      }),
      userC.sendFriendshipRequest({
        friendUserId: userA.id,
      }),
      userD.sendFriendshipRequest({
        friendUserId: userA.id,
      }),
      userE.sendFriendshipRequest({
        friendUserId: userA.id,
      }),
      userC.sendFriendshipRequest({
        friendUserId: userB.id,
      }),
    ])

    await Promise.all([
      userA.acceptFriendshipRequest({
        friendUserId: userB.id,
      }),
      userA.acceptFriendshipRequest({
        friendUserId: userC.id,
      }),
      userA.acceptFriendshipRequest({
        friendUserId: userD.id,
      }),
      userA.acceptFriendshipRequest({
        friendUserId: userE.id,
      }),
      userB.acceptFriendshipRequest({
        friendUserId: userC.id,
      }),
    ])

    const startTime = Date.now()
    await expect(
      userB.getFriendById({
        friendUserId: userA.id,
      })
    ).resolves.toEqual(
      expect.objectContaining({
        id: userA.id,
        mutualFriendCount: 1,
      })
    )
    // eslint-disable-next-line no-console
    console.log(
      `Time taken for Question 4 (Count mutual friends) - Scenario 1: ${
        Date.now() - startTime
      }ms`
    )
  })
})
