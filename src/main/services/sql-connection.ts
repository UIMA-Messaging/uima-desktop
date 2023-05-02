import sqlite3, { Database } from 'sqlite3'
import isDev from 'electron-is-dev'
import fs from 'fs'
import path from 'path'

isDev && sqlite3.verbose()

export default class SqlConnection {
	private database: Database

	constructor(database: Database) {
		this.database = database
	}

	static create(database: string): SqlConnection {
		if (!database.endsWith('.db')) {
			throw Error('Invalid database file not ending with `.db`')
		}
		const dbDir = path.resolve(__dirname, '../databases')
		const dbPath = path.resolve(dbDir, database)
		fs.mkdir(dbDir, { recursive: true }, () => {})
		fs.access(dbPath, fs.constants.F_OK, (error) => {
			if (error) {
				console.log('Database file does not exist. Creating a new one.')
				fs.writeFile(dbPath, '', () => {})
			}
		})
		return new SqlConnection(new Database(dbPath))
	}

	public async execute(sql: string, obj?: any): Promise<void> {
		if (!this.database) {
			throw Error('Database not initialized yet!')
		}
		const entity = this.objToEntity(sql, obj)
		return new Promise((resolve, reject) => {
			this.database.run(sql.replace(/[\r\t]/g, ''), entity, (error) => {
				error ? reject(error) : resolve()
			})
		})
	}

	public async query<T>(sql: string, obj?: any): Promise<T[]> {
		if (!this.database) {
			throw Error('Database not initialized yet!')
		}
		const entity = this.objToEntity(sql, obj)
		return new Promise((resolve, reject) => {
			this.database.all(sql.replace(/[\r\t]/g, ''), entity, (error, rows) => {
				error ? reject(error) : resolve(rows as T[])
			})
		})
	}

	public async querySingle<T>(sql: string, obj?: any): Promise<T> {
		if (!this.database) {
			throw Error('Database not initialized yet!')
		}
		const entity = this.objToEntity(sql, obj)
		return new Promise((resolve, reject) => {
			this.database.get(sql.replace(/[\r\t]/g, ''), entity, (error, row) => {
				error ? reject(error) : resolve(row as T)
			})
		})
	}

	private objToEntity(sql: string, obj: any): any {
		const entity = {}
		if (obj && sql) {
			const columns = sql.match(/\$\w+/g)
			if (columns) {
				Object.keys(obj).forEach((key) => {
					const renamed = '$' + key
					if (columns.includes(renamed)) {
						// @ts-ignore
						entity[renamed] = obj[key]
					}
				})
			}
		}
		return entity
	}
}
