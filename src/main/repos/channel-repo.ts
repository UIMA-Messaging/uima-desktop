import { Channel, User } from '../../common/types'
import SqlConnection from '../services/sql-connection'
import ContactRepo from './contact-repo'

interface StoredChannelMember {
	userId: string
	channelId: string
}

export default class ChannelRepo {
	private connection: SqlConnection
	private contacts: ContactRepo

	constructor(connection: SqlConnection, contacts: ContactRepo) {
		this.connection = connection
		this.contacts = contacts

		console.log('Creating `Channels` and `ChannelMembers` tables if they do not already exist.')

		this.connection.execute(`
			CREATE TABLE IF NOT EXISTS Channels (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				type TEXT,
				image TEXT
			);`)

		this.connection.execute(`
			CREATE TABLE IF NOT EXISTS ChannelMembers (
				userId TEXT NOT NULL,
				channelId TEXT NOT NULL,
				FOREIGN KEY (userId) REFERENCES Users(id),
				FOREIGN KEY (channelId) REFERENCES Channels(id)
				PRIMARY KEY (userId, channelId)
			);`)
	}

	public async getAllChannels(): Promise<Channel[]> {
		const channels = await this.connection.query<Channel>('SELECT * FROM Channels')
		channels.forEach(async (channel) => {
			channel.members = await this.getAllMembersFromChannel(channel.id)
		})
		return channels
	}

	public async getChannelById(id: string): Promise<Channel> {
		const channel = await this.connection.querySingle<Channel>(
			`
				SELECT * FROM Channels 
				WHERE id = $id 
				LIMIT 1
			`,
			{ id }
		)
		channel.members = await this.getAllMembersFromChannel(channel.id)
		return channel
	}

	public async getAllMembersFromChannel(channelId: string): Promise<User[]> {
		const stored = await this.connection.query<StoredChannelMember>(
			`
				SELECT * 
				FROM ChannelMembers 
				WHERE ChannelId = $channelId
			`,
			{ channelId }
		)

		const members: User[] = []
		stored.forEach(async (m) => members.push(await this.contacts.getContactById(m.userId)))

		return members
	}

	public async createOrUpdateChannel(channel: Channel): Promise<void> {
		channel.members.forEach(async (member) => {
			await this.createOrUpdateChannelMember(channel.id, member)
		})

		await this.connection.execute(
			`
				INSERT INTO Channels (
					id,
					name,
					image,
					type
				) VALUES (
					$id,
					$name,
					$image,
					$type
				) ON CONFLICT(id) DO UPDATE SET
					name = $name,
					image = $image,
					type = $type
			`,
			{ ...channel }
		)
	}

	public async createOrUpdateChannelMember(channelId: string, member: User): Promise<void> {
		await this.connection.execute(
			`
				INSERT INTO ChannelMembers (id, nick, userId, channelId)
				VALUES ($id, $nick, $userId, $channelId)
				ON CONFLICT(id)
				DO UPDATE SET
					nick = $nick,
					userId = $userId,
					channelId = $channelId;
			`,
			{
				channelId: channelId,
				userId: member.id,
			}
		)
	}

	public async deleteChannelById(id: string): Promise<void> {
		await this.connection.execute('DELETE FROM Channels WHERE id = $id', { id })
	}
}
