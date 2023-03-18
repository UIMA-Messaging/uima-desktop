import { Channel, ChannelMemeber } from '../../common/types'
import SqlConnection from '../services/sqlConnection'

export default class ChannelRepo {
  private connection: SqlConnection

  constructor(connection: SqlConnection) {
    this.connection = connection

    console.log('Creating `Channels` table if it does not already exist.')
    this.connection.execute(`
      CREATE TABLE IF NOT EXISTS Channels (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT
      );`)

    console.log('Creating `ChannelMembers` table if it does not already exist.')
    this.connection.execute(`
      CREATE TABLE IF NOT EXISTS ChannelMembers (
        id TEXT PRIMARY KEY,
        nick TEXT NOT NULL,
        userId TEXT NOT NULL,
        channelId TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id),
        FOREIGN KEY (channelId) REFERENCES Channels(id)
      );`)
  }

  public async getAllChannels(): Promise<Channel[]> {
    const channels = await this.connection.query<Channel>('SELECT * FROM Channels')
    channels.forEach(async (channel) => {
      channel.memebers = await this.getAllMembersFromChannel(channel.id)
    })
    return channels
  }

  public async getAllMembersFromChannel(channelId: string): Promise<ChannelMemeber[]> {
    return await this.connection.query<ChannelMemeber>('SELECT * FROM ChannelMemebers WHERE ChannelId = $channelId', { channelId })
  }

  public async createOrUpdateChannel(channel: Channel): Promise<void> {
    channel.memebers.forEach(async (member) => {
      await this.createOrUpdateChannelMemeber(channel.id, member)
    })
    await this.connection.execute(
      `
        INSERT INTO Channels (
          id,
          name,
          image,
          description
        ) VALUES (
          $id,
          $name,
          $image,
          $description
        ) ON CONFLICT(id) DO UPDATE SET
          name = $name,
          image = $image,
          description = $description
      `,
      channel
    )
  }

  public async createOrUpdateChannelMemeber(channelId: string, memeber: ChannelMemeber): Promise<void> {
    await this.connection.execute(
      `
        INSERT INTO ChannelMembers (id, nick, userId, channelId)
        VALUES ($id, $nick, $userId, $channelId)
        ON CONFLICT(id)
        DO UPDATE SET
            nick = $nick,
            userId = $userId,
            channelId = $channelId;
      `,
      { channelId, ...memeber }
    )
  }
}
