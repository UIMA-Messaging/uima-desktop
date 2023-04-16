import { EncryptedMessage } from '../../common/types/SigalProtocol'
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

	private rotateSendingRatchet(chainKey: string) {
		this.sendingRatchet = new Ratchet(this.rootRatchet.next(chainKey).chainKey)
	}

	private rotateReceivingRatchet(chainKey: string) {
		this.receivingRatchet = new Ratchet(this.rootRatchet.next(chainKey).chainKey)
	}

	public send(toEncrypt: any): EncryptedMessage {
		const { chainKey, messageKey } = this.sendingRatchet.next()
		this.rotateSendingRatchet(chainKey)
		const ciphertext = encrypt(toEncrypt, messageKey)
		this.messageCounter++
		this.latestMessageDate = new Date()
		return {
			header: {
				counter: this.messageCounter,
				timestamp: this.latestMessageDate,
			},
			ciphertext,
		}
	}

	public receive(message: EncryptedMessage): any {
		this.validataHeader(message.header)
		const { chainKey, messageKey } = this.receivingRatchet.next()
		this.rotateReceivingRatchet(chainKey)
		const decrypted = decrypt(message.ciphertext, messageKey)
		this.messageCounter++
		return decrypted
	}

	private validataHeader(header: { counter: number; timestamp: Date }) {
		if (header.counter > this.messageCounter) {
			throw Error(`Encryption out-of-sync. Message received out of order. Revceived message ${header.counter} when most resent was ${this.messageCounter}`)
		}
		if (header.timestamp > this.latestMessageDate) {
			throw Error(`Encryption out-of-sync. Message received out of order. Revceived message at ${header.timestamp} when most resent was ${this.latestMessageDate}`)
		}
	}
}
