import { Client, Stanza } from 'node-xmpp-client'
import xml from '@xmpp/xml'
import EventEmitter from 'events'
import { Message } from '../../common/types'

export default class EjabberdClient extends EventEmitter {
  private xmpClient: Client
  private conneted: boolean

  constructor(jid: string, password: string, host: string, port: number) {
    super()
    this.xmpClient = new Client({ jid, password, host, port, reconnect: true })
    this.conneted = false

    this.xmpClient.on('online', () => {
      this.conneted = true
      this.xmpClient.send(xml('presence'))
      super.emit('onConnected', this.conneted)
    })

    this.xmpClient.on('offline', () => {
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
        const content = stanza?.children![1]?.children![0]
        const message: Message = {
          id: stanza.id,
          sender: stanza.from,
          receiver: stanza.to,
          content: content,
          timestamp: new Date(),
        }
        super.emit('onReceive', message, stanza)
      }
    })
  }

  public send(message: Message) {
    if (!this.conneted) {
      throw Error('User not connected to XMP client.')
    }
    const stanza = xml('message', { to: message.receiver, type: 'chat' }, xml('body', null, message.content))
    this.xmpClient.send(stanza)
    super.emit('onSend', message, stanza)
  }

  public isConnected(): boolean {
    return this.conneted
  }
}
