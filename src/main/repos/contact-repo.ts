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
				id TEXT PRIMARY KEY,
				username TEXT,
				displayName TEXT,
				image TEXT,
				joinedAt DATETIME,
				editedAt DATETIME
			);`)
	}

	public async getAllContacts(): Promise<User[]> {
		return await connection.query<User>('SELECT * FROM Contacts')
	}

	public async getContactById(id: string): Promise<User> {
		return await connection.querySingle<User>('SELECT * FROM Contacts WHERE id = $id LIMIT 1', { id })
	}

	public async createOrUpdateContact(contact: User): Promise<void> {
		await connection.execute(
			`
				INSERT INTO Contacts (id, username, displayName, image, joinedAt, editedAt)
				VALUES ($id, $username, $displayName, $image, $joinedAt, $editedAt)
				ON CONFLICT(id) DO UPDATE SET
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
		await connection.execute('DELETE FROM Contacts WHERE id = $id', { id })
	}
}
