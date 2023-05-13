import { User } from '../../common/types'
import SqlConnection from '../services/sql-connection'

export default class ContactRepo {
	private connection: SqlConnection

	constructor(connection: SqlConnection) {
		this.connection = connection

		console.log('Creating `Contacts` table if it does not already exist.')
		this.connection.execute(`
			CREATE TABLE IF NOT EXISTS Contacts (
				id TEXT PRIMARY KEY,
				jid TEXT,
				username TEXT,
				displayName TEXT,
				image TEXT,
				fingerprint TEXT,
				joinedAt DATETIME,
				editedAt DATETIME
			);`)
	}

	public async getAllContacts(): Promise<User[]> {
		return await this.connection.query<User>('SELECT * FROM Contacts')
	}

	public async getContactById(id: string): Promise<User> {
		return await this.connection.querySingle<User>(
			`
				SELECT * 
				FROM Contacts 
				WHERE id = $id 
				LIMIT 1
			`,
			{ id }
		)
	}

	public async createOrUpdateContact(contact: User): Promise<void> {
		await this.connection.execute(
			`
				INSERT INTO Contacts (
					id,
					jid, 
					username, 
					displayName, 
					image, 
					joinedAt, 
					editedAt)
				VALUES (
					$id, 
					$jid, 
					$username, 
					$displayName, 
					$image, 
					$joinedAt, 
					$editedAt)
				ON CONFLICT(id) DO UPDATE SET
					jid = $jid,
					username = $username,
					displayName = $displayName,
					image = $image,
					joinedAt = $joinedAt,
					editedAt = $editedAt;
			`,
			contact
		)
	}

	public async deleteContactById(id: string) {
		await this.connection.execute('DELETE FROM Contacts WHERE id = $id', { id })
	}
}
