import type { Transaction } from 'kysely'
import type { DB } from './types'

import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely'
import SQLite from 'better-sqlite3'

import { dbLogger } from './logger'

declare const global: typeof globalThis & { db?: Database }

export const createDB = () => {
  return new Kysely<DB>({
    dialect: new SqliteDialect({
      database: new SQLite('./src/server/db/db.sqlite'),
    }),
    plugins: [
      new CamelCasePlugin({
        underscoreBeforeDigits: true,
      }),
    ],
    log: dbLogger,
  })
}

export const db = global.db || createDB()

global.db = db

export type Database = Kysely<DB>
export type DBTransaction = Transaction<DB>
