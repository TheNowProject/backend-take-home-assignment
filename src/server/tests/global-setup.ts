/* eslint-disable no-console */

import { db } from '../db'

let teardownHappened = false

export const setup = async () => {
  await dropAllData()
}

export const teardown = async () => {
  if (teardownHappened) {
    throw new Error('teardown called twice')
  }
  teardownHappened = true

  await dropAllData()
}

const dropAllData = async () => {
  const log = console.log
  console.log = () => {
    // suppress console.log
  }

  await db.transaction().execute(async (t) => {
    const promises = (['users', 'friendships'] as const).map((name) =>
      t.deleteFrom(name).execute()
    )

    await Promise.all(promises)
  })

  // restore console.log
  console.log = log
}
