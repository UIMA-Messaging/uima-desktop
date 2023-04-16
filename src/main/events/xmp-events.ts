import { Message } from '../../common/types'
import { notifyOfMessage, notifyOfStatus, notifyOfError } from '../handlers/xmp-handlers'
import { ejabberd, messages } from '..'

ejabberd.on('onConnected', (isConnected) => {
	console.log('User now connected to chating server.')
	notifyOfStatus(isConnected)
})

ejabberd.on('onDisconnected', (isConnected) => {
	console.log('User disconnected from chating server.')
	notifyOfStatus(isConnected)
})

ejabberd.on('onMessageReceived', (message: Message) => {
	notifyOfMessage(message)
	messages.createMessage(message)
})

ejabberd.on('onMessageSent', (message: Message) => {
	messages.createMessage(message)
})

ejabberd.on('onError', (error: string) => {
	notifyOfError(error)
})
