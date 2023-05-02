import { Message } from '../../common/types'
import SqlConnection from '../services/sql-connection'
import ContactRepo from './contact-repo'

interface StoreMessage {
	id: string
	channelId: string
	authorId: string
	content: string
	timestamp: Date
}

export default class MessageRepo {
	private connection: SqlConnection
	private contacts: ContactRepo

	constructor(connection: SqlConnection, contacts: ContactRepo) {
		this.connection = connection
		this.contacts = contacts

		console.log('Creating `Messages` table if it does not already exist.')
		this.connection.execute(`
			CREATE TABLE IF NOT EXISTS Messages (
				id TEXT PRIMARY KEY,
				channelId TEXT,
				authorId TEXT,
				content TEXT,
				timestamp DATETIME,
				FOREIGN KEY (channelId) REFERENCES Channels(id),
				FOREIGN KEY (authorId) REFERENCES Contacts(id)
			)`)
	}

	public async getMessagesByChannelId(channelId: string, limit: number = 100, offset: number = 0): Promise<Message[]> {
		const stored = await this.connection.query<StoreMessage>(
			`
				SELECT * FROM Messages 
				WHERE channelId = $channelId 
				LIMIT $limit OFFSET $offset
			`,
			{ channelId, limit, offset }
		)

		const messages: Message[] = []
		for (const message of stored) {
			messages.push({
				id: message.id,
				author: await this.contacts.getContactById(message.authorId),
				content: message.content,
				timestamp: message.timestamp,
			})
		}

		return messages
	}

	public async createMessage(channelId: string, message: Message): Promise<void> {
		await this.connection.execute(
			`
				INSERT INTO Messages (
					id, 
					channelId, 
					authorId,
					content, 
					timestamp)
				VALUES (
					$id, 
					$channelId, 
					$authorId, 
					$content, 
					$timestamp)
			`,
			{
				id: message.id,
				channelId: channelId,
				authorId: message.author.id,
				content: message.content,
				timestamp: message.timestamp,
			}
		)
	}
}
