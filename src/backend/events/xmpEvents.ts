import { Channel, Message } from '../../common/types'
import { notifyOfMessage, notifyOfStatus, notifyOfError } from '../handlers/xmpHandlers'
import { channels, ejabberd, messages } from '../main'

ejabberd.on('onConnected', (isConnected) => {
  console.log('User now connected to chating server.')
  notifyOfStatus(isConnected)
})

ejabberd.on('onDisconnected', (isConnected) => {
  console.log('User disconnected from chating server.')
  notifyOfStatus(isConnected)
})

ejabberd.on('onMessageReceive', (message: Message) => {
  notifyOfMessage(message)
  messages.createMessage(message)
})

ejabberd.on('onMessageSend', (message: Message) => {
  messages.createMessage(message)
})

ejabberd.on('onError', (error: string) => {
  notifyOfError(error)
})
