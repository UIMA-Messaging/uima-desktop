import { User } from '../../common/types'
import { connection } from '..'
import SqlConnection from '../services/sql-connection'

export default class ContactRepo {
	private connection: SqlConnection

	constructor(connection: SqlConnection) {
		this.connection = connection

		console.log('Creating `Contacts` table if it does not already exist.')
		this.connection.execute(`
			CREATE TABLE IF NOT EXISTS Contacts (
				username TEXT PRIMARY KEY,
				displayName TEXT,
				image TEXT,
				joinedAt DATETIME,
				editedAt DATETIME
			);`)
	}

	public async getAllContacts(): Promise<User[]> {
		return await connection.query<User>('SELECT * FROM Contacts')
	}

	public async getContactByUsername(username: string): Promise<User> {
		return await connection.querySingle<User>('SELECT * FROM Contacts WHERE username = $username LIMIT 1', { username })
	}

	public async createOrUpdateContact(contact: User): Promise<void> {
		await connection.execute(
			`
				INSERT INTO Contacts (username, displayName, image, joinedAt, editedAt)
				VALUES ($username, $displayName, $image, $joinedAt, $editedAt)
				ON CONFLICT(username) DO UPDATE SET
				displayName = $displayName,
				image = $image,
				joinedAt = $joinedAt,
				editedAt = $editedAt;
			`,
			contact
		)
	}

	public async deleteContactByUsername(username: string) {
		await connection.execute('DELETE FROM Contacts WHERE username = $username', { username })
	}
}
