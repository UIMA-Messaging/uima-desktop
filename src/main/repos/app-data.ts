import { decrypt, encrypt } from '../security/utils'
import { createHash } from 'crypto'
import SqlConnection from '../services/sql-connection'

interface PersistentData {
	id: string
	data: string
	sensitive: boolean
	modifiedAt: Date
}

export default class AppData {
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

	public setEncryptionKey(cipherStrategy: () => string) {
		this.key = cipherStrategy()
	}

	public static defaultCipherStrategy(...args: any) {
		return createHash('SHA256').update(JSON.stringify(args)).digest('hex')
	}

	public invalidate() {
		delete this.key
	}

	public async set(id: string, data: any, sensitive: boolean = false) {
		if (sensitive && !this.key) {
			throw Error('Cannot encrypt data when no encryption key is set.')
		}

		if (!data) {
			Error(`Cannot save empty data! Received \`${typeof data}\``)
		}

		try {
			data = JSON.stringify(data)
		} catch {}

		const record: PersistentData = {
			id: id,
			data: sensitive ? encrypt(data, this.key) : data,
			sensitive: sensitive,
			modifiedAt: new Date(),
		}

		await this.connection.execute(
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

	public async get<T>(id: string): Promise<T> {
		const record = await this.connection.querySingle<PersistentData>('SELECT * FROM AppData WHERE id = $id', { id })

		if (!record) {
			return null
		}

		if (record.sensitive && !this.key) {
			throw Error('Cannot decrypt sensitive data when encryption key is unset.')
		}

		const data = record.sensitive ? decrypt(record.data, this.key) : record.data

		try {
			return JSON.parse(data) as T
		} catch {
			return data as T
		}
	}

	public async delete(id: string): Promise<void> {
		await this.connection.execute('DELETE FROM AppData WHERE id = $id', { id })
	}

	public async erase(cipherStrategy: () => string): Promise<void> {
		if (cipherStrategy() !== this.key) {
			throw Error('Invalid encryption key')
		}

		const tables = await this.connection.query<{ name: string }>("SELECT name FROM sqlite_master WHERE type='table'")
		for (var table of tables) {
			await this.connection.execute(`DROP TABLE ${table.name}`)
		}
	}
}
