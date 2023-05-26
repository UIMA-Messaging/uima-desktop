import { IpcMainEvent, ipcMain } from 'electron'
import { channels, messageTypes } from '../../common/constants'
import { appData, contacts, ejabberd, encryption, channels as contactChannels, window } from '..'
import { Channel, Invitation, Token, User, ContactRemoval } from '../../common/types'
import { getKeyBundleForUser } from '../clients/identity-client'
import { v4 } from 'uuid'

ipcMain.handle(channels.CONTACTS.GET_ALL, async (_: IpcMainEvent) => {
	return await contacts.getAllContacts()
})

ipcMain.handle(channels.CONTACTS.GET, async (_: IpcMainEvent, id: string) => {
	return await contacts.getContactById(id)
})

ipcMain.on(channels.CONTACTS.CREATE, async (event: IpcMainEvent, contact: User) => {
	const existingContact = await contacts.getContactById(contact.id)

	if (existingContact) {
		await contacts.createOrUpdateContact(contact)
		event.sender.send(channels.CONTACTS.ON_CHANGE, contact)
	} else {
		try {
			const user = await appData.get<User>('user.profile')
			const token = await appData.get<Token>('user.token')

			const bundle = await getKeyBundleForUser(user.id, contact.id, token.accessToken)
			const { postKeyBundle, fingerprint } = await encryption.establishExchange(contact.id, bundle)

			const channelId = v4()

			const invitation: Invitation = {
				channelId: channelId,
				timestamp: new Date(),
				user: user,
				postKeyBundle: postKeyBundle,
			}
			await ejabberd.send(contact.jid, messageTypes.CONTACT.INVITATION, invitation)

			try {
				contact.fingerprint = fingerprint
				await contacts.createOrUpdateContact(contact)
				event.sender.send(channels.CONTACTS.ON_CREATE, contact)
			} catch (error) {
				console.log('Could not create contact:', error.message)
				event.sender.send(channels.ON_ERROR, 'contacts.error', 'Could not create contact.')
			}

			try {
				const channel: Channel = {
					id: channelId,
					name: contact.username,
					type: 'dm',
					members: [contact],
				}

				await contactChannels.createOrUpdateChannel(channel)

				event.sender.send(channels.CHANNELS.ON_CREATE, channel)
			} catch (error) {
				console.log('Could not create channel for contact:', error.message)
				event.sender.send(channels.ON_ERROR, 'contacts.error', 'Could not create channel for contact.')
			}
		} catch (error) {
			event.sender.send(channels.ON_ERROR, 'contacts.error', 'Could not add user as contact')
		}
	}
})

ipcMain.on(channels.CONTACTS.DELETE, async (event: IpcMainEvent, id: string) => {
	const user = await contacts.getContactById(id)

	if (user) {
		try {
			const sender = await appData.get<User>('user.profile')
			const channel = await contactChannels.getDMChannel(id)

			const deinvite: ContactRemoval = {
				channelId: id,
				timestamp: new Date(),
				user: sender,
			}

			console.log('SENDING', deinvite)

			for (const member of channel.members) {
				try {
					await ejabberd.send(member.jid, messageTypes.CONTACT.REMOVAL, deinvite)
				} catch (error) {
					console.log('Could not send message to member ' + member.displayName, error.message)
					event.sender.send(channels.ON_ERROR, 'messages.error', 'Could not send message to ' + member.displayName)
				}
			}

			try {
				await contactChannels.deleteChannelById(channel.id)
				event.sender.send(channels.CHANNELS.ON_DELETE, channel)
			} catch (error) {
				console.log('Could no remove conversation for contact ' + user.displayName, error.message)
				event.sender.send(channels.ON_ERROR, 'contacts.error', 'Could not remove conversation for contact ' + user.displayName)
			}

			try {
				await contacts.deleteContactById(id)
				event.sender.send(channels.CONTACTS.ON_DELETE, user)
			} catch (error) {
				console.log('Could not remove user from contacts:', error.message)
				event.sender.send(channels.ON_ERROR, 'contacts.error', 'Could not remove user from contacts.')
			}
		} catch (error) {
			console.log('Could not send disinvite:', error.message)
			throw error
			event.sender.send(channels.ON_ERROR, 'contacts.error', 'Could not send disinvite to contact ' + user.displayName)
		}
	} else {
		event.sender.send(channels.ON_ERROR, 'contacts.error', 'Contact not found. Cannot delete contact.')
	}
})

export function notifyOfNewContact(newContact: User) {
	window.webContents.send(channels.CONTACTS.ON_CREATE, newContact)
}

export function notifyOfContactRemoval(removedContact: User) {
	window.webContents.send(channels.CONTACTS.ON_DELETE, removedContact)
}
