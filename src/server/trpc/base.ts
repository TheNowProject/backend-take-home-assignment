import { initTRPC } from '@trpc/server'
import { ZodError } from 'zod'
import superjson from 'superjson'

import { db } from '../db'

type Session = {
  userId: number
}

export const t = initTRPC.context<typeof createInnerTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * This helper generates the "internals" for a tRPC context.
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createInnerTRPCContext = (opts: { session?: Session }) => {
  return {
    session: opts.session,
    db,
  }
}
