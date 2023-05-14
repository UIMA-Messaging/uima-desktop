import xml from '@xmpp/xml'
import EventEmitter from 'events'
import { Client, Stanza } from 'node-xmpp-client'
import { JabberUser } from '../../common/types'

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
		console.log('Connecting with:', user)

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

		this.client.on('error', (error: any) => {
			console.log(error)
			this.emit('onError', error)
		})

		this.client.on('stanza', (stanza: Stanza) => {
			console.log('Received message:', JSON.stringify(stanza, null, 2))

			const { type, content } = JSON.parse(null)
			this.emit('onReceived', type, content)
		})

		this.client.connect()
	}

	public disconnect() {
		try {
			this.client.send(xml('presence', { type: 'unavailable' }))
			setTimeout(() => {
				// @ts-ignore
				this.client?.end()
			}, 100)
			delete this.client
			this.connected = false
		} catch {
			console.log('Could not disconnect from XMP client.')
		}
	}

	public send(recipientJid: string, type: string, message: object) {
		console.log('Sending message to:', recipientJid, message)
		if (!this.client) {
			throw Error('XMP user not configured yet.')
		}
		if (!this.connected) {
			throw Error('User not connected to XMP client.')
		}
		const payload = xml('body', null, JSON.stringify({ type: type, content: message }))
		const stanza = xml('message', { to: recipientJid }, payload)
		this.client.send(stanza)
	}

	public isConnected(): boolean {
		return this.connected
	}
}
