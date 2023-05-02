import { KeyBundle } from './Keys'
import { ExchangeKeys } from './SigalProtocol'

export interface User {
	id: string
	jid?: string
	displayName: string
	username: string
	image: string
	joinedAt: Date
	editedAt?: Date
}

export interface JabberUser {
	username: string
	password: string
}
