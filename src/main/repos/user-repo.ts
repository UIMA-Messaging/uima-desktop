import { User } from '../../common/types'
import { connection } from '../main'
import SqlConnection from '../services/sql-connection'

export default class UserRepo {
    private connection: SqlConnection

    constructor(connection: SqlConnection) {
        this.connection = connection
        console.log('Creating `Users` table if it does not already exist.')
        this.connection.execute(`
      CREATE TABLE IF NOT EXISTS Users (
          Id TEXT PRIMARY KEY,
          DisplayName TEXT,
          Username TEXT,
          Image TEXT,
          JoinedAt DATETIME,
          EditedAt DATETIME
      );`)
    }

    public async getAllUsers(): Promise<User[]> {
        return await connection.query<User>('SELECT * FROM Users')
    }

    public async createOrUpdateUser(user: User): Promise<void> {
        await connection.execute(
            `
      INSERT INTO Users (id, displayName, username, image, joinedAt, editedAt)
      VALUES ($id, $displayName, $username, $image, $joinedAt, $editedAt)
      ON CONFLICT(id) DO UPDATE SET
      displayName = $displayName,
      username = $username,
      image = $image,
      editedAt = $editedAt;
    `,
            user
        )
    }
}
