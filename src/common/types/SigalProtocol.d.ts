export interface KeyPair {
	publicKey: string
	privateKey: string
}

export interface X3DHKeyPairs {
	identityKeys: KeyPair
	signedPreKeys: KeyPair
	oneTimePreKeys: KeyPair[]
	signature: string
}

export interface ExchangeKeys {
	identityKey: string
	signedPreKey: string
	oneTimePreKeys: string[]
	signature: string
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
	signedPreKey: string
	identityKey: string
	oneTimePreKey: string
}

export interface PostKeyBundle {
	oneTimePreKey: string
	identityKey: string
	ephemeralKey: string
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
