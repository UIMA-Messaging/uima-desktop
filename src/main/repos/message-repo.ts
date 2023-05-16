import { appData } from '..'
import { Message, User } from '../../common/types'
import SqlConnection from '../services/sql-connection'
import ContactRepo from './contact-repo'

interface StoreMessage {
	id: string
	channelId: string
	authorId: string
	plaintext: string
	ciphertext: string
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
				plaintext TEXT,
				ciphertext TEXT,
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
				ORDER BY timestamp DESC
				LIMIT $limit OFFSET $offset
			`,
			{ channelId, limit, offset }
		)

		const messages: Message[] = []
		for (const message of stored) {
			let author = await this.contacts.getContactById(message.authorId)

			// big meh
			if (!author) {
				const profile = await appData.get<User>('user.profile')
				if (profile.id === message.authorId) {
					author = profile
				}
			}

			messages.push({ ...message, author })
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
					plaintext,
					ciphertext, 
					timestamp)
				VALUES (
					$id, 
					$channelId, 
					$authorId, 
					$plaintext,
					$ciphertext,
					$timestamp)
			`,
			{
				...message,
				authorId: message.author.id,
				channelId,
			}
		)
	}
}
