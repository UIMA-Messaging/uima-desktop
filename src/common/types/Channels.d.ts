import { User } from './User'

export interface Channel {
	id: string
	name: string
	type: 'dm' | 'group'
	image?: string
	members: User[]
}

export interface Message {
	id: string
	author: User
	content: string
	timestamp: Date
}
