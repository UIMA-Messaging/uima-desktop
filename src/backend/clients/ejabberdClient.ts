import { Client, Stanza } from 'node-xmpp-client'
import xml from '@xmpp/xml'
import EventEmitter from 'events'
import { Message } from '../../common/types'

export default class EjabberdClient extends EventEmitter {
  private xmpClient: Client
  private conneted: boolean
  private host: string
  private port: number

  constructor(host: string, port: number) {
    super()
    this.conneted = false
    this.host = host
    this.port = port
  }

  public setJabberUser(jid: string, password: string) {
    this.xmpClient = new Client({ jid, password, host: this.host, port: this.port, reconnect: true })

    this.xmpClient.on('online', () => {
      this.conneted = true
      this.xmpClient.send(xml('presence'))
      super.emit('onConnected', this.conneted)
    })

    this.xmpClient.on('disconnect', () => {
      this.conneted = false
      super.emit('onDisconnected', this.conneted)
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

  public send(recipientJid: string, message: Message) {
    if (!this.xmpClient) {
      throw Error('Ejabberd user not configured yet.')
    }
    if (!this.conneted) {
      throw Error('User not connected to XMP client.')
    }
    const payload = xml('body', null, JSON.stringify(message))
    const stanza = xml('message', { to: recipientJid, type: 'chat' }, payload)
    this.xmpClient.send(stanza)
    super.emit('onSend', message)
  }

  public isConnected(): boolean {
    return this.conneted
  }
}
