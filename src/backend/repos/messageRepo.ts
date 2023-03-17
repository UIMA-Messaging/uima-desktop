import { Message } from '../../common/types'
import { connection } from '../main'

try {
  connection.execute(`
    CREATE TABLE Channels (
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
  console.log(await connection.query<Message>('SELECT * FROM Messages WHERE ChannelId = $channelId', { channelId: message.channelId }))
}

export async function deleteMessage(message: Message): Promise<void> {
  await connection.execute(`DELETE FROM Messages WHERE Id = $id`, { id: message.id })
}

export async function deleteConverstion(channelId: string): Promise<void> {
  await connection.execute(`DELETE FROM Messages WHERE ChannelId = $channelId`, { channelId })
}
