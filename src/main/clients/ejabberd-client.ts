import { Client, Stanza, Element } from 'node-xmpp-client'
import xml from '@xmpp/xml'
import { Message } from '../../common/types'
import { JabberUser } from '../../common/types/User'
import EventEmitter from 'events'

export default class EjabberdClient extends EventEmitter {
	private xmpClient: Client
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
		this.xmpClient = new Client({ jid: user.username, password: user.password, host: this.host, port: this.port, reconnect: true })

		this.xmpClient.on('online', () => {
			this.connected = true
			this.xmpClient.send(xml('presence'))
			this.emit('onConnected', this.connected)
		})

		this.xmpClient.on('disconnect', () => {
			this.connected = false
			this.emit('onDisconnected', this.connected)
		})

		this.xmpClient.on('error', (error: Error) => {
			console.log(error.message)
			this.emit('onError', error)
		})

		this.xmpClient.on('stanza', (stanza: Stanza) => {
			console.log(JSON.stringify(stanza, null, 2))
			if (this.isMessage(stanza)) {
				this.emit('onMessageReceived', this.getMessage(stanza))
			}
		})
	}

	public createJabberUser(username: string, password: string): JabberUser {
		return { username: `${username}@${this.host}`, password }
	}

	public disconnect() {
		this.xmpClient.disconnect()
		this.xmpClient = null
		this.host = null
		this.port = null
		this.connected = false
	}

	private isMessage(stanza: Stanza): boolean {
		// @ts-ignore
		return !!stanza?.children.find((child) => child.name === 'body')
	}

	private getMessage(stanza: Stanza): Message {
		// @ts-ignore
		const content = stanza?.children.find((child) => child.name === 'body')
		return JSON.parse(content)
	}

	public sendMessage(recipientJid: string, message: Message) {
		if (!this.xmpClient) {
			throw Error('Ejabberd user not configured yet.')
		}
		if (!this.connected) {
			throw Error('User not connected to XMP client.')
		}
		const payload = xml('body', null, JSON.stringify(message))
		const stanza = xml('message', { to: recipientJid, type: 'chat' }, payload)
		this.xmpClient.send(stanza)
		this.emit('onMessageSent', message)
	}

	public isConnected(): boolean {
		return this.connected
	}
}
