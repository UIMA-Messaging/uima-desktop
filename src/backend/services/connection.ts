import sqlite3, { Database } from 'sqlite3'
import isDev from 'electron-is-dev'
import fs from 'fs'
import path from 'path'

isDev && sqlite3.verbose()

export default class SqlConnection {
  private repository: Database

  constructor(database: string) {
    if (!database.endsWith('.db')) {
      throw Error('Invalid database file not ending with `.db`')
    }
    const dbDir = path.resolve(__dirname, '../databases')
    const dbPath = path.resolve(dbDir, database)
    fs.mkdir(dbDir, { recursive: true }, () => {})
    fs.access(dbPath, fs.constants.F_OK, function (err) {
      if (err) {
        console.log('Database file does not exist. Creating a new one.', err.message)
        fs.writeFile(dbPath, '', () => {})
      }
    })
    this.repository = new Database(dbPath)
  }

  public async execute(sql: string, obj?: any): Promise<void> {
    const entity = this.objToEntity(sql, obj)
    return new Promise((resolve, reject) => {
      this.repository.run(sql, entity, (error: Error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  public async query<T>(sql: string, obj?: any): Promise<T[]> {
    const entity = this.objToEntity(sql, obj)
    return new Promise((resolve, reject) => {
      this.repository.all(sql, entity, (error: Error, rows: any) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as T[])
        }
      })
    })
  }

  public async querySingle<T>(sql: string, obj?: any): Promise<T> {
    const entity = this.objToEntity(sql, obj)
    return new Promise((resolve, reject) => {
      this.repository.get(sql, entity, (error: Error, row: any) => {
        if (error) {
          reject(error)
        } else {
          resolve(row as T)
        }
      })
    })
  }

  private objToEntity(sql: string, obj: any): any {
    const entity = {}
    if (obj) {
      const columns = sql.match(/\$\w+/g)
      Object.keys(obj).forEach((key) => {
        const renamed = '$' + key
        if (columns.includes(renamed)) {
          // @ts-ignore
          entity[renamed] = obj[key]
        }
      })
    }
    return entity
  }
}
