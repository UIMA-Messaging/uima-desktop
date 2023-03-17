import { Message } from '../../common/types'
import SqlConnection from './connection'

const connection = new SqlConnection('main.db')

try {
  connection.execute(`CREATE TABLE Messages (
        Id TEXT PRIMARY KEY,
        ChannelId TEXT,
        Sender TEXT,
        Receiver TEXT,
        Content TEXT,
        Timestamp DATETIME
      )`)
} catch (error) {
  console.log('Messages table already exists.')
}

export async function getMessages(channelId: string, limit: number = 100, offset: number = 0): Promise<Message[]> {
  return await connection.query<Message>(
    `
      SELECT * FROM Messages 
      WHERE ChannelId = $channelId 
      LIMIT $limit OFFSET $offset
    `,
    { limit, offset, channelId }
  )
}

export async function insertMessage(message: Message): Promise<void> {
  await connection.execute(
    `
    INSERT INTO Messages (Id, ChannelId, Sender, Receiver, Content, Timestamp)
    VALUES ($id, $channelId, $sender, $receiver, $content, $timestamp)
  `,
    message
  )
}

export async function deleteMessage(message: Message): Promise<void> {
  await connection.execute(`DELETE FROM Messages WHERE Id = $id`, { id: message.id })
}

export async function deleteConverstion(channelId: string): Promise<void> {
  await connection.execute(`DELETE FROM Messages WHERE ChannelId = $channelId`, { channelId })
}
