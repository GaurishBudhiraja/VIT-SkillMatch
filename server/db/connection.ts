import { DatabaseSync } from 'node:sqlite'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { LOCAL_DB_PATH } from '@/server/config'
import { LOCAL_DB_SCHEMA } from '@/server/db/schema'

let database: DatabaseSync | null = null

function ensureDatabaseDirectory(filePath: string) {
  const directory = path.dirname(path.resolve(filePath))
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true })
  }
}

function initializeDatabase(db: DatabaseSync) {
  db.exec(LOCAL_DB_SCHEMA)
}

export function getDatabase() {
  if (!database) {
    ensureDatabaseDirectory(LOCAL_DB_PATH)
    database = new DatabaseSync(LOCAL_DB_PATH)
    initializeDatabase(database)
  }

  return database
}
