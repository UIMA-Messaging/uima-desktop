import { PostKeyBundle } from './SigalProtocol'
import { User } from './User'

export interface Invitation {
	id: string
	timestamp: Date
	user: User
	postKeyBundle: PostKeyBundle
}
