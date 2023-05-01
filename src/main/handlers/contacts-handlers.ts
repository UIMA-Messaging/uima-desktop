import { IpcMainEvent, ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { contacts } from '..'
import { User } from '../../common/types'

ipcMain.handle(channels.CONTACTS.GET_ALL, async (_: IpcMainEvent) => {
	return await contacts.getAllContacts()
})

ipcMain.handle(channels.CONTACTS.GET, async (_: IpcMainEvent, id: string) => {
	return await contacts.getContactById(id)
})

ipcMain.on(channels.CONTACTS.CREATE, async (event: IpcMainEvent, contact: User) => {
	// check if exists already locally. if doesn't, then fetch key bundle, else proceed with update
	const user = await contacts.getContactById(contact.id)
	await contacts.createOrUpdateContact(contact)

	if (user) {
		event.sender.send(channels.CONTACTS.ON_CHANGE, contact)
	} else {
		event.sender.send(channels.CONTACTS.ON_CREATE, contact)
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
