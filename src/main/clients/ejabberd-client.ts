import xml from '@xmpp/xml'
import EventEmitter from 'events'
import { Client, Stanza } from 'node-xmpp-client'
import { JabberUser } from '../../common/types'
import { NetworkMessage } from '../../common/types/SigalProtocol'

export default class EjabberdClient extends EventEmitter {
	private client: Client
	private connected: boolean
	private host: string
	private port: number

	constructor(host: string, port: number) {
		super()
		this.connected = false
		this.host = host
		this.port = port
	}

	public connect(user: JabberUser) {
		this.client = new Client({
			jid: user.username,
			password: user.password,
			host: this.host,
			port: this.port,
			reconnect: true,
		})

		this.client.on('online', () => {
			this.client.send(xml('presence'))
			this.connected = true
			this.emit('onConnected')
		})

		this.client.on('offline', () => {
			this.connected = false
			this.emit('onDisconnected')
		})

		this.client.on('error', (error: Error) => {
			console.log(error.message)
			this.emit('onError', error)
		})

		this.client.on('stanza', (stanza: Stanza) => {
			console.log(JSON.stringify(stanza, null, 2))
			this.emit('onMessageReceived', null)
		})

		this.client.connect()
	}

	public createJabberUser(username: string, password: string): JabberUser {
		return { username: `${username}@${this.host}`, password }
	}

	public disconnect() {
		this.client?.disconnect()
		this.connected = false
	}

	public sendMessage(recipientJid: string, message: NetworkMessage) {
		if (!this.client) {
			throw Error('Ejabberd user not configured yet.')
		}
		if (!this.connected) {
			throw Error('User not connected to XMP client.')
		}
		const payload = xml('body', null, JSON.stringify(message))
		const stanza = xml('message', { to: recipientJid, type: 'chat' }, payload)
		this.client.send(stanza)
	}

	public isConnected(): boolean {
		return this.connected
	}
}
