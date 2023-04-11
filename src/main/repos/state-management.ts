import { connection } from '../index'
import { decrypt, encrypt } from '../security/encryption'
import { createHash } from 'crypto'
import SqlConnection from '../services/sql-connection'

interface PersistentData {
	id: string
	data: string
	sensitive: boolean
	modifiedAt: Date
}

export default class StateManagement {
	private connection: SqlConnection
	private key: string

	constructor(connection: SqlConnection) {
		this.connection = connection
		console.log('Creating `AppData` table if it does not already exist.')
		this.connection.execute(`
			CREATE TABLE IF NOT EXISTS AppData(
				id TEXT PRIMARY KEY, 
				data TEXT, 
				sensitive INTEGER CHECK (sensitive IN (0, 1)), 
				modifiedAt DATETIME
			);`)
	}

	public setEncryptionKey(key: string) {
		this.key = createHash('SHA256').update(key).digest('hex')
	}

	public invalidateEncryptionKey() {
		delete this.key
	}

	public async set(id: string, data: string, sensitive: boolean = false) {
		if (!data) {
			Error(`Cannot save empty data! Received \`${typeof data}\``)
		}
		const record: PersistentData = {
			id: id,
			data: sensitive ? encrypt(data, this.key) : data,
			sensitive: sensitive,
			modifiedAt: new Date(),
		}
		await connection.execute(
			`
			INSERT INTO AppData(id, data, sensitive, modifiedAt) 
			VALUES ($id, $data, $sensitive, $modifiedAt)
			ON CONFLICT(id) DO UPDATE SET 
				data = excluded.data,
				modifiedAt = excluded.modifiedAt,
				sensitive = excluded.sensitive;
			`,
			record
		)
	}

	public async get(id: string): Promise<string> {
		const record = await connection.querySingle<PersistentData>('SELECT * FROM AppData WHERE id = $id', { id })
		return record?.sensitive ? decrypt(record.data, this.key) : record?.data
	}
}
