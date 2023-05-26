import { KeyBundle } from './Keys'
import { ExchangeKeys } from './SigalProtocol'

export interface User {
	id: string
	jid?: string
	displayName: string
	username: string
	image: string
	fingerprint?: string[]
	joinedAt: Date
	editedAt?: Date
}

export interface JabberUser {
	username: string
	password: string
}

export interface Token {
	accessToken: string
	expiresIn: number
	tokenType: string
	creationDate: Date
}
