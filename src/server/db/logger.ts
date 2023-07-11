/* eslint-disable no-console */

import type { LogConfig } from 'kysely'

import { format } from 'sql-formatter'

export const dbLogger: LogConfig = (event) => {
  if (event.query.sql.includes('begin') || event.query.sql.includes('commit')) {
    return
  }

  const color = event.level === 'error' ? '\x1b[31m' : '\x1b[33m'

  console.log(
    prependLines(formatSql(event.query.sql + ';'), '|>  '),
    `\n${color}|>  ${event.queryDurationMillis}ms\n\n`
  )

  console.log(event.query.parameters)

  console.log('\n\n=======================================================\n\n')
}

const prependLines = (str: string, prefix: string) =>
  str
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n')

const formatSql = (sql: string) => {
  return format(sql, {
    language: 'sqlite',
  })
}
