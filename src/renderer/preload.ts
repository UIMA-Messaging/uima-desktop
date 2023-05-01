import { channels } from '../common/constants'
import { Credentials, Registration, Message, User } from '../common/types'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
	getAppData: (key: string) => ipcRenderer.invoke(channels.APP_DATA.GET, key),
	setAppData: (key: string, value: any) => ipcRenderer.send(channels.APP_DATA.SET, key, value),
	onAppDataChange: (callback: (key: string, value: any) => void) => ipcRenderer.on(channels.APP_DATA.ON_CHANGE, (_, key, value) => callback(key, value)),

	onError: (callback: (type: string, message: string) => void) => ipcRenderer.on(channels.ON_ERROR, (_, type, message) => callback(type, message)),

	register: (registration: Registration) => ipcRenderer.send(channels.AUTH.REGISTER, registration),
	login: (credentials: Credentials) => ipcRenderer.send(channels.AUTH.LOGIN, credentials),
	logout: () => ipcRenderer.send(channels.AUTH.LOGOUT),

	getAuthState: () => ipcRenderer.invoke(channels.AUTH.STATE),
	onAuthStateChange: (callback: (state: 'notRegistered' | 'loggedOut' | 'loggedIn') => void) => ipcRenderer.on(channels.AUTH.STATE, (_, state) => callback(state)),

	isOnline: () => ipcRenderer.invoke(channels.XMP.ONLINE),
	onOnline: (callback: (isOnline: boolean) => void) => ipcRenderer.on(channels.XMP.ONLINE, (_, isOnline) => callback(isOnline)),

	sendMessage: (recipientJid: string, message: Message) => ipcRenderer.send(channels.MESSAGES.SEND, recipientJid, message),
	getMessagesFromContact: (callback: (id: string) => void) => ipcRenderer.on(channels.MESSAGES.GET, (_, message) => callback(message)),
	onMessageReceive: (callback: (message: Message) => void) => ipcRenderer.on(channels.MESSAGES.ON_RECEIVED, (_, message) => callback(message)),
	onMessageSent: (callback: (message: Message) => void) => ipcRenderer.on(channels.MESSAGES.ON_SENT, (_, message) => callback(message)),

	getAllContacts: () => ipcRenderer.invoke(channels.CONTACTS.GET_ALL),
	getContactById: (id: string) => ipcRenderer.invoke(channels.CONTACTS.GET, id),
	createContact: (contact: User) => ipcRenderer.send(channels.CONTACTS.CREATE, contact),
	deleteContactById: (id: string) => ipcRenderer.send(channels.CONTACTS.DELETE, id),
	onContactChange: (callback: (contact: User) => void) => ipcRenderer.on(channels.CONTACTS.ON_CHANGE, (_, contact) => callback(contact)),
	onContactCreate: (callback: (contact: User) => void) => ipcRenderer.on(channels.CONTACTS.ON_CREATE, (_, contact) => callback(contact)),
	onContactDelete: (callback: (contact: User) => void) => ipcRenderer.on(channels.CONTACTS.ON_DELETE, (_, contact) => callback(contact)),
})
