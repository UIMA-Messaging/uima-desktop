import { IpcMainEvent, ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { appData, contacts, encryption } from '..'
import { User } from '../../common/types'
import { getKeyBundleForUser } from '../clients/identity-client'

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
			const user = JSON.parse(await appData.get<any>('user.profile')) as User
			const bundle = await getKeyBundleForUser(contact.id, user.id)
			encryption.establishExchange(contact.id, bundle)
			await contacts.createOrUpdateContact(contact)
			
			event.sender.send(channels.CONTACTS.ON_CREATE, contact)
		} catch (error) {
			event.sender.send(channels.ON_ERROR, 'contacts.error', error)
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
