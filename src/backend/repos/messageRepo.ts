import { Message } from '../../common/types'
import SqlConnection from './connection'

const repo = new SqlConnection('messages.db')

try {
  repo.execute(`CREATE TABLE Messages (
        Id TEXT PRIMARY KEY,
        Sender TEXT,
        Receiver TEXT,
        Content TEXT,
        Timestamp DATETIME
      )`)
} catch (error) {
  console.log('Messages table already exists.')
}

export async function getMessages(): Promise<Message[]> {
  return await repo.query<Message>('SELECT * FROM Messages')
}
