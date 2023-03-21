import { Client, Stanza, Element } from 'node-xmpp-client'
import xml from '@xmpp/xml'
import { Channel, Message } from '../../common/types'
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

  public connect(username: string, password: string) {
    this.xmpClient = new Client({ jid: `${username}@${this.host}`, password, host: this.host, port: this.port, reconnect: true })

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
        this.emit('onMessageReceive', this.getMessage(stanza))
      } else if (this.isChannelInvite(stanza)) {
        this.emit('onChannelInvite', this.getChannelInvite(stanza))
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

  public joinChannel(channel: Channel, nickname?: string) {
    this.xmpClient.send(xml('presence', { to: channel.id + '/' + nickname }))
    this.emit('onChannelJoin', channel, nickname)
  }

  public joinDM(jid: string) {
    this.xmpClient.send(
      xml('presence', {
        to: jid,
        type: 'subscribe',
      })
    )
    this.emit('onJoinDM')
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

  private isChannelInvite(stanza: Stanza): boolean {
    // @ts-ignore
    return !!stanza.children.find((child) => child.attrs?.xmlns === 'jabber:x:conference')
  }

  private getChannelInvite(stanza: Stanza): Channel {
    // @ts-ignore
    const content = stanza.children.find((child) => child.attrs?.xmlns === 'jabber:x:conference').attrs
    const channel: Channel = JSON.parse(content.reason)
    channel.id = content.jid
    return channel
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
    this.emit('onMessageSend', message)
  }

  public isConnected(): boolean {
    return this.connected
  }
}
