import { Client, Stanza } from 'node-xmpp-client'
import xml from '@xmpp/xml'
import EventEmitter from 'events'
import { Message } from '../../common/types'

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

  public connect(jid: string, password: string) {
    this.xmpClient = new Client({ jid, password, host: this.host, port: this.port, reconnect: true })

    this.xmpClient.on('online', () => {
      this.connected = true
      this.xmpClient.send(xml('presence'))
      super.emit('onConnected', this.connected)
    })

    this.xmpClient.on('disconnect', () => {
      this.connected = false
      super.emit('onDisconnected', this.connected)
    })

    this.xmpClient.on('error', (error: Error) => {
      console.log(error)
      super.emit('onError', error)
    })

    this.xmpClient.on('stanza', (stanza: Stanza) => {
      if (stanza.name === 'message') {
        // @ts-ignore
        // const attribute = stanza?.children[0]!.attrs?.message
        const content = stanza?.children![1]?.children![0]
        const message: Message = JSON.parse(content)
        super.emit('onReceive', message)
      }
    })
  }

  public disconnect() {
    this.xmpClient.disconnect()
    this.xmpClient = null
    this.host = null
    this.port = null
    this.connected = false
  }

  public send(recipientJid: string, message: Message) {
    if (!this.xmpClient) {
      throw Error('Ejabberd user not configured yet.')
    }
    if (!this.connected) {
      throw Error('User not connected to XMP client.')
    }
    const payload = xml('body', null, JSON.stringify(message))
    const stanza = xml('message', { to: recipientJid, type: 'chat' }, payload)
    this.xmpClient.send(stanza)
    super.emit('onSend', message)
  }

  public isConnected(): boolean {
    return this.connected
  }
}
