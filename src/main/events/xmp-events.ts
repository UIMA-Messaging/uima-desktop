import { channels, contacts, ejabberd, encryption, messages } from '..'
import { Channel, ContactRemoval, Invitation, Message, NetworkMessage, User } from '../../common/types'
import { notifyOfStatus, notifyOfError } from '../handlers/xmp-handlers'
import { notifyOfNewMessage } from '../handlers/message-handlers'
import { messageTypes } from '../../common/constants'
import { notifyOfContactRemoval, notifyOfNewContact } from '../handlers/contacts-handlers'
import { notifyRendererOfNewChannel, notifyRendererOfRemovedChannel } from '../handlers/channel-handlers'

ejabberd.on('onReceived', async (type: string, content: any) => {
	try {
		switch (type) {
			case messageTypes.CONTACT.REMOVAL:
				console.log('RECEIVED', content)

				const { user: userToDelete } = content as ContactRemoval

				try {
					await contacts.deleteContactById(userToDelete.id)
					notifyOfContactRemoval(userToDelete)
				} catch (error) {
					console.log('Could not remove user from contacts:', error.message)
					notifyOfError('Could not remove contact for deinvitation')
				}

				try {
					const channel = await channels.getDMChannel(userToDelete.id)
					await channels.deleteChannelById(channel.id)
					notifyRendererOfRemovedChannel(channel)
				} catch (error) {
					console.log('Could no remove conversation for contact ' + userToDelete.displayName, error.message)
					notifyOfError('Could not remove conversation for contact for deinvitation')
				}

				break
			case messageTypes.CONTACT.INVITATION:
				console.log('RECEIVED', content)

				const { channelId: agreedChannelId, user, postKeyBundle } = content as Invitation

				const { fingerprint } = await encryption.establishedPostExchange(user.id, postKeyBundle)

				user.fingerprint = fingerprint
				await contacts.createOrUpdateContact(user)
				notifyOfNewContact(user)

				const channel: Channel = {
					id: agreedChannelId,
					name: user.username,
					type: 'dm',
					image: user.image,
					members: [user],
				}
				await channels.createOrUpdateChannel(channel)
				notifyRendererOfNewChannel(channel)

				break
			case messageTypes.CHANNELS.MESSAGE:
				const networkMessage = content as NetworkMessage
				const { message: decrypted } = await encryption.decrypt(content)

				const { channelId, message: decryptedMessage } = JSON.parse(decrypted) as { channelId: string; message: Message }

				decryptedMessage.ciphertext = networkMessage.content?.ciphertext
				messages.createMessage(channelId, decryptedMessage)
				notifyOfNewMessage(channelId, decryptedMessage)

				break
			case messageTypes.GROUP.INVITATION:
				break
			default:
				console.log('Unhandled message:', content)
				break
		}
	} catch (error) {
		console.log('Could not handle message received from XMP host:', error.message)
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
