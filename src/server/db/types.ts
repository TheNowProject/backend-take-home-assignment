import type { ColumnType } from 'kysely'
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Friendship = {
  id: Generated<number>
  userId: number
  friendUserId: number
  status: string
  createdAt: Generated<string>
  updatedAt: Generated<string>
}
export type User = {
  id: Generated<number>
  fullName: string
  phoneNumber: string
  createdAt: Generated<string>
  updatedAt: Generated<string>
}
export type DB = {
  friendships: Friendship
  users: User
}
