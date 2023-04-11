import { connection } from '../main'
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
				Id TEXT PRIMARY KEY, 
				Data TEXT, 
				Sensitive INTEGER CHECK (Sensitive IN (0, 1)), 
				ModifiedAt DATETIME
			);`)
	}

	public setEncryptionKey(key: string) {
		this.key = createHash('SHA256').update(key).digest('hex')
	}

	public invalidateEncryptionKey() {
		delete this.key
	}

	public async set(id: string, data: string, sensitive: boolean = false) {
		const record: PersistentData = {
			id: id,
			data: sensitive ? encrypt(data, this.key) : data,
			sensitive: sensitive,
			modifiedAt: new Date(),
		}
		await connection.execute(
			`
			INSERT INTO AppData(Id, Data, Sensitive, ModifiedAt) 
			VALUES ($id, $data, $sensitive, $modifiedAt)
			ON CONFLICT(Id) DO UPDATE SET 
				Data = excluded.Data,
				ModifiedAt = excluded.ModifiedAt,
				Sensitive = excluded.Sensitive;
			`,
			record
		)
	}

	public async get(id: string): Promise<string> {
		console.log('getting', id)
		const result = await connection.querySingle<PersistentData>('SELECT * FROM AppData WHERE Id = $id', { id })
		console.log("result", result)
		return result?.sensitive ? decrypt(result.data, this.key) : result?.data
	}
}
