import ElectronStore from "electron-store";
import CryptoJS from "crypto-js";

export default class StateManagement {
  private userEncryptionKey: string;
  private store: ElectronStore;

  constructor(userEncryptionKey: string, store: ElectronStore) {
    this.userEncryptionKey = userEncryptionKey;
    this.store = store;
  }

  public set(key: string, obj: any, override?: boolean): void {
    if (override && this.store.get(key)) {
      throw Error(`Object with key \`${key}\` already exists.`);
    }
    this.store.set(key, obj);
  }

  public get<Type>(key: string): Type {
    const obj = this.store.get(key);
    return obj ? (obj as Type) : null;
  }

  public setUserSensitive(key: string, obj: any, override?: boolean): void {
    if (override && this.store.get(key)) {
      throw Error(`Object with key \`${key}\` already exists.`);
    }
    let encrypted = this.encrypt(obj, this.userEncryptionKey);
    this.store.set(key, encrypted);
  }

  public getUserSensitive<Type>(key: string): Type {
    const encrypted = this.store.get(key);
    const decrypted = this.decrypt(encrypted, this.userEncryptionKey);
    const obj = JSON.parse(decrypted);
    return obj ? (obj as Type) : null;
  }

  private encrypt(obj: any, encryptionKey: string): string {
    const json = JSON.stringify(obj);
    return CryptoJS.AES.encrypt(json, encryptionKey).toString();
  }

  private decrypt(obj: any, encryptionKey: string) {
    return CryptoJS.AES.decrypt(obj, encryptionKey).toString(CryptoJS.enc.Utf8);
  }
}