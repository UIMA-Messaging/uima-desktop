import { IpcMainEvent, ipcMain } from 'electron'
import { channels, messageTypes } from '../../common/constants'
import { appData, contacts, ejabberd, encryption, channels as chattingChannels } from '..'
import { Channel, Invitation, User } from '../../common/types'
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
			const token = await appData.get<string>('user.token')

			const bundle = await getKeyBundleForUser(contact.id, user.id, token)
			const { postKeyBundle, fingerprint } = await encryption.establishExchange(contact.id, bundle)

			const invitation: Invitation = {
				id: v4(),
				timestamp: new Date(),
				user: user,
				postKeyBundle: postKeyBundle,
			}
			ejabberd.send(contact.jid, messageTypes.CONTACT.INVITATION, invitation)

			contact.fingerprint = fingerprint

			try {
				await contacts.createOrUpdateContact(contact)
			} catch (e) {
				console.log(e.message)
				event.sender.send(channels.ON_ERROR, 'contacts.error', 'Could not create contact.')
			}

			event.sender.send(channels.CONTACTS.ON_CREATE, contact)

			const channel: Channel = {
				id: v4(),
				name: contact.displayName,
				type: 'dm',
				members: [contact],
			}

			try {
				await chattingChannels.createOrUpdateChannel(channel)
			} catch (e) {
				console.log(e.message)
				event.sender.send(channels.ON_ERROR, 'contacts.error', 'Could not create channel for contact.')
			}

			event.sender.send(channels.CHANNELS.ON_CREATE, channel)
		} catch (error) {
			event.sender.send(channels.ON_ERROR, 'contacts.error', 'Could not add user as contact')
		}
	}
})

ipcMain.on(channels.CONTACTS.DELETE, async (event: IpcMainEvent, id: string) => {
	const user = await contacts.getContactById(id)
	if (user) {
		await contacts.deleteContactById(id)
		event.sender.send(channels.CONTACTS.ON_DELETE, user)
	} else {
		event.sender.send(channels.ON_ERROR, 'contacts.error', 'Contact not found. Cannot delete contact.')
	}
})
