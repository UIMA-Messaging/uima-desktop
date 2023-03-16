import { Message } from '../../common/types'
import { notifyOfMessage, notifyOfStatus, notifyOfError } from '../channels/xmpHandlers'
import { ejabberd } from '../main'

ejabberd.on('onConnected', (isConnected) => {
  console.log('User now connected to chating server.')
  notifyOfStatus(isConnected)
})

ejabberd.on('onDisconnected', (isConnected) => {
  console.log('User disconnected from chating server.')
  notifyOfStatus(isConnected)
})

ejabberd.on('onReceive', (message: Message) => {
  notifyOfMessage(message)
})

ejabberd.on('onError', (message: string) => {
  notifyOfError(message)
})
