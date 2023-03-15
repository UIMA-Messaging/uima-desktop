import { Stanza } from 'node-xmpp-client'
import { channels } from '../../common/constants'
import { Message } from '../../common/types'
import { createdWindow, ejabberd } from '../main'

ejabberd.on('onConnected', () => {
  console.log('User now connected to chating server.')
})

ejabberd.on('onDisconnected', () => {
  console.log('User disconnected from chating server.')
})

ejabberd.on('onSend', (message: Message, stanza: Stanza) => {
  console.log('Just sent a message to ' + message.receiver, message.content)
})

ejabberd.on('onReceive', (message: Message, stanza: Stanza) => {
  console.log('Received message from ' + message.sender, message.content)
  createdWindow.webContents.send(channels.RECEIVE_MESSAGE, message)
})
