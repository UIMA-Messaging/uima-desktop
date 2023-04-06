import { connection } from '../main'
import SqlConnection from '../services/sql-connection'
import crypto from "crypto"

export interface PersistentData {
  id: string
  json: string
  createdAt: Date
  accessedAt: Date
}

export default class StateManagement {
  private connection: SqlConnection
  private encryptionKey: string

  constructor(connection: SqlConnection) {
    this.connection = connection
    console.log('Creating `AppPersistentData` table if it does not already exist.')
    this.connection.execute(`
    CREATE TABLE IF NOT EXISTS AppData (
      Id TEXT PRIMARY KEY,
      Json TEXT,
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
    await connection.execute('INSERT INTO AppPersistentData(Id, Json) VALUES ($id, $json);', { id, json: JSON.stringify(obj) })
  }

  public async get(id: string): Promise<PersistentData[]> {
    return await connection.query<PersistentData>('SELECT * FROM AppPersistentData WHERE Id = id', { id })
  }

  public async setSensitive() {}

  public async getSensitive() {}

  private encrypt(decrypted: any): string {
    const json = JSON.stringify(decrypted)
    return CryptoJS.AES.encrypt(json, this.encryptionKey).toString()
  }

  private decrypt(encrypted: any) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.encryptionKey)
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
  }
}
