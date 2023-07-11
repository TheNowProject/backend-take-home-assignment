import { z } from 'zod'

export const IdSchema = z.number().int().min(1)

export const CountSchema = z.preprocess((arg) => {
  if (!arg) {
    return 0
  }
  if (typeof arg === 'string') {
    return parseInt(arg, 10)
  }
  if (typeof arg === 'bigint') {
    return Number(arg)
  }
  return arg
}, z.number().int().min(0).max(Number.MAX_SAFE_INTEGER))

export const NonEmptyStringSchema = z.preprocess((arg) => {
  if (arg === '' || arg === null) {
    return undefined
  }
  if (typeof arg === 'number' || arg instanceof BigInt) {
    return String(arg)
  }
  if (arg instanceof Date) {
    return arg.toISOString()
  }
  return arg
}, z.string().min(1))
