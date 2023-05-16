import { client, xml, Client } from '@xmpp/client'
import EventEmitter from 'events'
import { JabberUser } from '../../common/types'
import { Element } from '@xmpp/xml'
import isDev from 'electron-is-dev'
import debug from '@xmpp/debug'

export default class EjabberdClient extends EventEmitter {
	private client: Client
	private connected: boolean
	private service: string
	private domain: string

	constructor(service: string, domain: string) {
		super()

		this.connected = false
		this.service = service
		this.domain = domain
	}

	public connect(user: JabberUser) {
		console.log('Connecting with:', user)

		this.client = client({
			service: this.service,
			domain: this.domain,
			username: user.username.split('@')![0],
			password: user.password,
		})

		this.client.on('online', async () => {
			await this.client.send(xml('presence'))
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

		this.client.on('stanza', async (stanza: Element) => {
			try {
				const body = stanza.getChildText('body')
				const { type, content } = JSON.parse(body)
				this.emit('onReceived', type, content)
			} catch (e) {
				console.log('Generic XMP message received:', stanza)
			}
		})

		debug(this.client, isDev)

		this.client.start()
	}

	public async disconnect() {
		try {
			await this.client.stop()
			delete this.client
			this.connected = false
		} catch {
			console.log('Could not disconnect from XMP client.')
		}
	}

	public async send(recipientJid: string, type: string, message: object) {
		if (!this.client) {
			throw Error('XMP user not configured yet.')
		}

		if (!this.connected) {
			throw Error('User not connected to XMP client.')
		}

		const payload = xml('body', {}, JSON.stringify({ type: type, content: message }))
		const stanza = xml('message', { to: recipientJid }, payload)

		await this.client.send(stanza)
	}

	public isConnected(): boolean {
		return this.connected
	}
}
