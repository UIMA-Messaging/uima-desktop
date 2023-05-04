import { ejabberd, encryption } from '..'
import { Invitation, Message, NetworkMessage } from '../../common/types'
import { notifyOfStatus, notifyOfError } from '../handlers/xmp-handlers'
import { notifyOfNewMessage } from '../handlers/message-handlers'
import { messageTypes } from '../../common/constants'

ejabberd.on('onReceived', async (type: string, encryptedMessage: NetworkMessage) => {
	const { message: decrypted } = await encryption.decrypt(encryptedMessage)

	switch (type) {
		case messageTypes.CONTACT.INVITATION:
			const invitation = decrypted as Invitation
			await encryption.establishedPostExchange(invitation.user.id, invitation.postKeyBundle)
			break
		case messageTypes.CHANNELS.MESSAGE:
			const channelMessage = decrypted as { channelId: string; message: Message }
			notifyOfNewMessage(channelMessage.channelId, channelMessage.message)
			break
		case messageTypes.GROUP.INVITATION:
			break
		default:
			console.log('Unhandled message:', decrypted)
			break
	}
})

ejabberd.on('onConnected', () => {
	console.log('User now connected to chating server.')
	notifyOfStatus(true)
})

ejabberd.on('onDisconnected', () => {
	console.log('User disconnected from chating server.')
	notifyOfStatus(false)
})

ejabberd.on('onError', (error: string) => {
	notifyOfError(error)
})
