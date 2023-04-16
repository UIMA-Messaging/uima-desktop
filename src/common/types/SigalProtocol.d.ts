export interface KeyPair {
	publicKey: string
	privateKey: string
}

export interface X3DHKeyPairs {
	identityKeys: KeyPair
	signedPreKeys: KeyPair
	oneTimePreKeys: KeyPair[]
	outstandingExchanges: OutstandingExchangeRecord[]
}

export interface NetworkMessage {
	sender: string
	receiver: string
	content: EncryptedMessage
}

export interface EncryptedMessage {
	header: {
		counter: number
		timestamp: Date
	}
	ciphertext: string
}

export interface KeyBundle {
	userId: string
	publicSignedPreKey: string
	publicIdentityKey: string
	publicOneTimePreKey: string
}

export interface PostKeyBundle {
	userId: string
	publicIdentityKey: string
	publicEphemeralKey: string
}

export interface DoubleRatchetState {
	rootRatchet: {
		state: string
	}
	messageCounter: number
	latestMessageDate: Date
	sendingRatchet: {
		state: string
	}
	receivingRatchet: {
		state: string
	}
}
