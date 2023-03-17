import { connection } from '../main'

try {
  connection.execute(`
    CREATE TABLE Messages (
      Id TEXT PRIMARY KEY,
      ChannelId TEXT,
      Sender TEXT,
      Receiver TEXT,
      Content TEXT,
      Timestamp DATETIME
    )`)
  console.log('Created `Messages` table already exists.')
} catch (error) {
  console.log('Using already existing `Messages` table.')
}

