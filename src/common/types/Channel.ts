import { User } from './User'

export interface Channel {
  id: string
  name: string
  image: ChannelMemeber
}

export interface ChannelMemeber {
  id: string
  nick: string
  user: User
}
