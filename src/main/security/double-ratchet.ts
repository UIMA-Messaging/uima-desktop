import { EncryptedMessage, MessageHeader, DecryptedMessage } from '../../common/types/SigalProtocol'
import { kdf, encrypt, decrypt } from './encryption'

class Ratchet {
	private state: string

	constructor(key: string) {
		this.state = key
		this.next = this.next.bind(this)
	}

	next(prevChainKey = '') {
		const output = kdf(this.state + prevChainKey)
		this.state = kdf(output)
		const chainKey = output.slice(32, 64)
		const messageKey = output.slice(0, 32)
		return { chainKey, messageKey }
	}
}

export default class DoubleRatchet {
	private rootRatchet: Ratchet
	private messageCounter: number
	private latestMessageDate: Date
	private sendingRatchet: Ratchet
	private receivingRatchet: Ratchet

	constructor(rootKey: string, isInitiator = false) {
		this.rootRatchet = new Ratchet(rootKey)
		this.messageCounter = 0
		this.latestMessageDate = new Date()
		if (isInitiator) {
			this.sendingRatchet = new Ratchet(this.rootRatchet.next().chainKey)
			this.receivingRatchet = new Ratchet(this.rootRatchet.next().chainKey)
		} else {
			this.receivingRatchet = new Ratchet(this.rootRatchet.next().chainKey)
			this.sendingRatchet = new Ratchet(this.rootRatchet.next().chainKey)
		}
	}

	public rotateSendingRatchet(chainKey: string) {
		this.sendingRatchet = new Ratchet(this.rootRatchet.next(chainKey).chainKey)
	}

	public rotateReceivingRatchet(chainKey: string) {
		this.receivingRatchet = new Ratchet(this.rootRatchet.next(chainKey).chainKey)
	}

	public send(plaintext: string) {
		const { chainKey, messageKey } = this.sendingRatchet.next()
		this.rotateSendingRatchet(chainKey)
		const ciphertext = encrypt(plaintext, messageKey)
		this.messageCounter++
		this.latestMessageDate = new Date()
		return {
			header: {
				counter: this.messageCounter,
				date: this.latestMessageDate,
			},
			ciphertext,
		}
	}

	public receive(message: EncryptedMessage): DecryptedMessage {
		this.validataHeader(message.header)
		const { chainKey, messageKey } = this.receivingRatchet.next()
		this.rotateReceivingRatchet(chainKey)
		const plaintext = decrypt(message.ciphertext, messageKey)
		this.messageCounter++
		return { plaintext, ciphertext: message.ciphertext }
	}

	private validataHeader(header: MessageHeader) {
		if (header.counter > this.messageCounter) {
			throw Error(`Encryption out-of-sync. Message received out of order. Revceived message ${header.counter} when most resent was ${this.messageCounter}`)
		}
		if (header.date > this.latestMessageDate) {
			throw Error(`Encryption out-of-sync. Message received out of order. Revceived message at ${header.date} when most resent was ${this.latestMessageDate}`)
		}
	}
}
