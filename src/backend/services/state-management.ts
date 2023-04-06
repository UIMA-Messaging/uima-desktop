import ElectronStore from 'electron-store'
import crypto from 'crypto'

export default class StateManagement {
  private store: ElectronStore
  private encryptionKey: string

  constructor(store: ElectronStore) {
    this.store = store
  }

  public setEncryptionKey(key: string) {
    this.encryptionKey = key
  }

  public invalidateEncryptionKey() {
    this.encryptionKey = null
  }

  public set(key: string, obj: any, override?: boolean) {
    if (override && this.store.get(key)) {
      throw Error(`Object with key \`${key}\` already exists.`)
    }
    this.store.set(key, obj)
  }

  public get<Type>(key: string, thrw?: boolean): Type {
    const obj = this.store.get(key)
    if (thrw && !obj) {
      throw Error(`Object with key \`${key}\ does not exist.`)
    }
    return obj ? (obj as Type) : null
  }

  public setSensitive(key: string, obj: any, override?: boolean) {
    if (override && this.store.get(key)) {
      throw Error(`Object with key \`${key}\` already exists.`)
    }
    const encrypted = this.encrypt(obj)
    this.store.set(key, encrypted)
  }

  public getSensitive<Type>(key: string, thrw?: boolean): Type {
    const encrypted = this.store.get(key)
    if (thrw && !encrypted) {
      throw Error(`Object with key \`${key}\ does not exist.`)
    } else if (!encrypted) {
      return null
    }
    const obj = this.decrypt(encrypted)
    return obj ? (obj as Type) : null
  }

  private encrypt(decrypted: any): any {
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
