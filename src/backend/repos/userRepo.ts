import { User } from '../../common/types'
import { connection } from '../main'

try {
  connection.execute(`
    CREATE TABLE Users (
        Id TEXT PRIMARY KEY,
        DisplayName TEXT,
        Username TEXT,
        Image TEXT,
        JoinedAt DATETIME,
        EditedAt DATETIME
    );`)
  console.log('Created `Users` table already exists.')
} catch (error) {
  console.log('Using already existing `Users` table.')
}

export async function getAllUsers(): Promise<User[]> {
  return await connection.query<User>('SELECT * FROM Users')
}

export async function createOrUpdateUser(user: User): Promise<void> {
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
