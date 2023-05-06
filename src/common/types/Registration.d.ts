export interface Registration {
	username: string
	password: string
	image: any
}

export interface Credentials {
	username: string
	password: string
}

export interface RegisteredUser {
	id: string
	jid: string
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
