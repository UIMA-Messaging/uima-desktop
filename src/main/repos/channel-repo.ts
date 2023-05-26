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

		console.log('Creating `Channels` table if it does not already exist.')
		this.connection.execute(`
			CREATE TABLE IF NOT EXISTS Channels (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				type TEXT,
				image TEXT
			);`)

		console.log('Creating `ChannelMembers` table if it does not already exist.')
		this.connection.execute(`
			CREATE TABLE IF NOT EXISTS ChannelMembers (
				userId TEXT NOT NULL,
				channelId TEXT NOT NULL,
				FOREIGN KEY (userId) REFERENCES Contacts(id),
				FOREIGN KEY (channelId) REFERENCES Channels(id)
				PRIMARY KEY (userId, channelId)
			);`)
	}

	public async getAllChannels(): Promise<Channel[]> {
		const channels = await this.connection.query<Channel>('SELECT * FROM Channels')
		for (const channel of channels) {
			channel.members = await this.getAllMembersByChannelId(channel.id)
		}
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
		channel.members = await this.getAllMembersByChannelId(channel.id)
		return channel
	}

	public async getAllMembersByChannelId(channelId: string): Promise<User[]> {
		const stored = await this.connection.query<StoredChannelMember>(
			`
				SELECT * 
				FROM ChannelMembers 
				WHERE channelId = $channelId
			`,
			{ channelId }
		)

		const members: User[] = []
		for (const member of stored) {
			members.push(await this.contacts.getContactById(member.userId))
		}

		return members
	}

	public async createOrUpdateChannel(channel: Channel): Promise<void> {
		for (const member of channel.members) {
			await this.createOrUpdateChannelMember(channel.id, member)
		}

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
				INSERT INTO ChannelMembers (
					userId, 
					channelId)
				VALUES (
					$userId, 
					$channelId)
				ON CONFLICT(userId, channelId) DO NOTHING;
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

	public async deleteChannelMemeberById(id: string, channelId: string) {
		await this.connection.execute(
			`
				DELETE FROM ChannelMemeber 
				WHERE userId = $id 
					AND channelId = $channelId
			`,
			{ channelId, id }
		)
	}

	public async getDMChannel(contactId: string): Promise<Channel> {
		const channel = await this.connection.querySingle<Channel>(
			`
				SELECT id
				FROM Channels
				WHERE type = 'dm'
					AND id IN (
						SELECT channelId
						FROM ChannelMembers
						WHERE userId = $contactId
					);
			`,
			{ contactId }
		)

		channel.members = await this.getAllMembersByChannelId(channel.id)

		return channel
	}
}
