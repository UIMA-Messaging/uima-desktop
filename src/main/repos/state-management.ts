import { connection } from '..'
import SqlConnection from '../services/sql-connection'
import crypto from 'crypto'

export interface PersistentData {
	id: string
	data: string
	createdAt: Date
	accessedAt: Date
}

export default class StateManagement {
	private connection: SqlConnection
	private encryptionKey: string

	constructor(connection: SqlConnection) {
		this.connection = connection
		console.log('Creating `AppData` table if it does not already exist.')
		this.connection.execute(`
      CREATE TABLE IF NOT EXISTS AppData (
        Id TEXT PRIMARY KEY,
        Data TEXT,
        CreatedAt DATETIME,
        AccessedAt DATETIME
      );`)
	}

	public setEncryptionKey(key: string) {
		this.encryptionKey = key
	}

	public invalidateEncryptionKey() {
		delete this.encryptionKey
	}

	public async set(id: string, obj: any) {
		await connection.execute('INSERT INTO AppData(Id, Data) VALUES ($id, $data);', { id, data: JSON.stringify(obj) })
	}

	public async get<T>(id: string): Promise<T> {
		const result = await connection.querySingle<PersistentData>('SELECT * FROM AppData WHERE Id = $id', { id })
		return result ? (JSON.parse(result.data) as T) : null
	}

	public async setSensitive(id: string, obj: any) {
		const encrypted = this.encrypt(JSON.stringify(obj))
		await this.set(id, encrypted)
	}

	public async getSensitive<T>(id: string): Promise<T> {
		const encrypted = await this.get<string>(id)
		return encrypted ? (this.decrypt(encrypted) as T) : null
	}

	private encrypt(decrypted: any): string {
		const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, crypto.randomBytes(32))
		let encrypted = cipher.update(decrypted, 'utf8', 'hex')
		encrypted += cipher.final('hex')
		return encrypted
	}

	private decrypt(encrypted: any) {
		const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, crypto.randomBytes(32))
		let decrypted = decipher.update(encrypted, 'hex', 'utf8')
		decrypted += decipher.final('utf8')
		return decrypted
	}
}
