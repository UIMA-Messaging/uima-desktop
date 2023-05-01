import { KeyBundle } from './Keys'
import { ExchangeKeys } from './SigalProtocol'

export interface User {
	id: string
	displayName: string
	username: string
	image: string
	joinedAt: Date
	editedAt?: Date
}

export interface RegisteredUser {
	id: string
	displayName: string
	username: string
	image: string
	ephemeralPassword: string
	joinedAt: Date
}

export interface BasicUser {
	displayName: string
	image: string
	exchangeKeys: ExchangeKeys
}

export interface JabberUser {
	username: string
	password: string
}
