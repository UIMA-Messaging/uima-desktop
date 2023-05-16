import { channels, contacts, ejabberd, encryption } from '..'
import { Channel, Invitation, Message } from '../../common/types'
import { notifyOfStatus, notifyOfError } from '../handlers/xmp-handlers'
import { notifyOfNewMessage } from '../handlers/message-handlers'
import { messageTypes } from '../../common/constants'
import { v4 } from 'uuid'
import { notifyOfNewChannel, notifyOfNewContact } from '../handlers/contacts-handlers'

ejabberd.on('onReceived', async (type: string, content: any) => {
	try {
		console.log(content)

		switch (type) {
			case messageTypes.CONTACT.INVITATION:
				const { user, postKeyBundle } = content as Invitation

				const { fingerprint } = await encryption.establishedPostExchange(user.id, postKeyBundle)

				user.fingerprint = fingerprint
				await contacts.createOrUpdateContact(user)
				notifyOfNewContact(user)

				const channel: Channel = {
					id: v4(),
					name: user.username,
					type: 'dm',
					members: [user],
				}
				await channels.createOrUpdateChannel(channel)
				notifyOfNewChannel(channel)

				break
			case messageTypes.CHANNELS.MESSAGE:
				const { message: decrypted } = await encryption.decrypt(content)

				const channelMessage = decrypted as { channelId: string; message: Message }
				notifyOfNewMessage(channelMessage.channelId, channelMessage.message)

				break
			case messageTypes.GROUP.INVITATION:
				break
			default:
				console.log('Unhandled message:', content)
				break
		}
	} catch (error) {
		console.log('Could not handle message received from XMP host:', error.message)
		console.log(error)
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

ejabberd.on('onError', (error: any) => {
	notifyOfError(error)
})
