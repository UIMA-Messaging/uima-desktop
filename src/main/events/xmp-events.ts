import { NetworkMessage } from '../../common/types'
import { notifyOfStatus, notifyOfError } from '../handlers/xmp-handlers'
import { ejabberd, encryption } from '..'
import { notifyOfNewMessage } from '../handlers/message-handlers'

ejabberd.on('onConnected', () => {
	console.log('User now connected to chating server.')
	notifyOfStatus(true)
})

ejabberd.on('onDisconnected', () => {
	console.log('User disconnected from chating server.')
	notifyOfStatus(false)
})

ejabberd.on('onMessageReceived', async (encryptedMessage: NetworkMessage) => {
	const { message } = await encryption.decrypt(encryptedMessage)
	// notifyOfNewMessage(message)
})

ejabberd.on('onError', (error: string) => {
	notifyOfError(error)
})
