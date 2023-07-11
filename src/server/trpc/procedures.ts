import { authGuard } from './middlewares/auth-guard'
import { t } from './base'

export const procedure = t.procedure

export const protectedProcedure = procedure.use(authGuard)
