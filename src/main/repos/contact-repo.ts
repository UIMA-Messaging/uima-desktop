import { User } from '../../common/types'
import { connection } from '..'
import SqlConnection from '../services/sql-connection'

export default class ContactRepo {
	private connection: SqlConnection
	private key: string

	constructor(connection: SqlConnection) {
		this.connection = connection
		console.log('Creating `Contacts` table if it does not already exist.')
		this.connection.execute(`
      CREATE TABLE IF NOT EXISTS Contacts (
          Id TEXT PRIMARY KEY,
          DisplayName TEXT,
          Username TEXT,
          Image TEXT,
          JoinedAt DATETIME,
          EditedAt DATETIME
      );`)
	}

	public async getAllContacts(): Promise<User[]> {
		return await connection.query<User>('SELECT * FROM Contacts')
	}

	public async getContactById(id: string): Promise<User> {
		return await connection.querySingle<User>('SELECT 1 FROM Contacts WHERE id = $id', { id })
	}

	public async createOrUpdateContact(contact: User): Promise<void> {
		await connection.execute(
			`
      INSERT INTO Contacts (id, displayName, username, image, joinedAt, editedAt)
      VALUES ($id, $displayName, $username, $image, $joinedAt, $editedAt)
      ON CONFLICT(id) DO UPDATE SET
      displayName = $displayName,
      username = $username,
      image = $image,
      editedAt = $editedAt;
    `,
			contact
		)
	}

	public async deleteContactById(id: string) {
		await connection.execute('DELETE FROM Contacts WHERE id = $id', { id })
	}
}
