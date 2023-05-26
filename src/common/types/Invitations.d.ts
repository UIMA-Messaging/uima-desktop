import { PostKeyBundle } from './SigalProtocol'
import { User } from './User'

export interface Invitation {
	channelId: string
	timestamp: Date
	user: User
	postKeyBundle: PostKeyBundle
}

export interface ContactRemoval {
	timestamp: Date
	user: User
}
