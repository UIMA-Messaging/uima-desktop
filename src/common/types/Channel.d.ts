import { User } from './User'

export interface Channel {
	id: string
	name: string
	image?: string
	description?: string
	memebers?: ChannelMemeber[]
}

export interface ChannelMemeber {
	id: string
	nick?: string
	user: User
}
