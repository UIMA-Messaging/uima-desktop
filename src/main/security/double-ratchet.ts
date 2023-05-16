import { DoubleRatchetState, EncryptedMessage } from '../../common/types/SigalProtocol'
import { kdf, encrypt, decrypt } from './utils'

class Ratchet {
	private state: string

	constructor(key: string) {
		this.state = key
	}

	next(prevChainKey: string = ''): { chainKey: string; messageKey: string } {
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

	constructor(rootRatchet: Ratchet, sendingRatchet: Ratchet, receivingRatchet: Ratchet, messageCounter: number, latestMessageDate: Date) {
		this.rootRatchet = rootRatchet
		this.sendingRatchet = sendingRatchet
		this.receivingRatchet = receivingRatchet
		this.messageCounter = messageCounter
		this.latestMessageDate = latestMessageDate
	}

	public static init(rootKey: string, isInitiator = false): DoubleRatchet {
		const rootRatchet = new Ratchet(rootKey)
		let sendingRatchet: Ratchet
		let receivingRatchet: Ratchet
		if (isInitiator) {
			sendingRatchet = new Ratchet(rootRatchet.next().chainKey)
			receivingRatchet = new Ratchet(rootRatchet.next().chainKey)
		} else {
			receivingRatchet = new Ratchet(rootRatchet.next().chainKey)
			sendingRatchet = new Ratchet(rootRatchet.next().chainKey)
		}
		return new DoubleRatchet(rootRatchet, sendingRatchet, receivingRatchet, 0, new Date())
	}

	public static fromState(state: DoubleRatchetState) {
		const rootRatchet = new Ratchet(state.rootRatchet.state)
		const sendingRatchet = new Ratchet(state.sendingRatchet.state)
		const receivingRatchet = new Ratchet(state.receivingRatchet.state)
		return new DoubleRatchet(rootRatchet, sendingRatchet, receivingRatchet, state.messageCounter, state.latestMessageDate)
	}

	public getState(): DoubleRatchetState {
		return JSON.parse(JSON.stringify(this)) as DoubleRatchetState
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
		this.messageCounter++
		this.validataHeader(message.header)
		const { chainKey, messageKey } = this.receivingRatchet.next()
		this.rotateReceivingRatchet(chainKey)
		const decrypted = decrypt(message.ciphertext, messageKey)
		return decrypted
	}

	private validataHeader(header: { counter: number; timestamp: Date }) {
		if (header.counter > this.messageCounter) {
			throw Error(`Message received out of order. Received message ${header.counter} when most recent was ${this.messageCounter}`)
		}
		if (header.timestamp < this.latestMessageDate) {
			throw Error(`Encryption out-of-sync. Received message at ${header.timestamp} when most recent was ${this.latestMessageDate}`)
		}
	}
}
