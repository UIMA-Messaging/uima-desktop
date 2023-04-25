import { Message } from '../../common/types'
import SqlConnection from '../services/sql-connection'

export default class MessageRepo {
	private connection: SqlConnection

	constructor(connection: SqlConnection) {
		this.connection = connection

		console.log('Creating `Messages` table if it does not already exist.')
		this.connection.execute(`
			CREATE TABLE IF NOT EXISTS Messages (
				id TEXT PRIMARY KEY,
				channelId TEXT,
				sender TEXT,
				receiver TEXT,
				content TEXT,
				timestamp DATETIME,
				FOREIGN KEY (sender) REFERENCES Users(id),
				FOREIGN KEY (receiver) REFERENCES Users(id)
			)`)
	}

	public async getMessagesFromChannel(channelId: string, limit: number = 100, offset: number = 0): Promise<Message[]> {
		return await this.connection.query<Message>(
			`
				SELECT * FROM Messages 
				WHERE ChannelId = $channelId 
				LIMIT $limit OFFSET $offset
			`,
			{ limit, offset, channelId }
		)
	}

	public async createMessage(message: Message): Promise<void> {
		await this.connection.execute(
			`
				INSERT INTO Messages (Id, ChannelId, Sender, Receiver, Content, Timestamp)
				VALUES ($id, $channelId, $sender, $receiver, $content, $timestamp)
			`,
			message
		)
	}

	public async deleteMessage(message: Message): Promise<void> {
		await this.connection.execute(`DELETE FROM Messages WHERE Id = $id`, { id: message.id })
	}
}
