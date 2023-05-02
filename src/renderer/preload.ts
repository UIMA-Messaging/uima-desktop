import { channels } from '../common/constants'
import { Credentials, Registration, Message, User, Channel } from '../common/types'
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

	getAllChannels: () => ipcRenderer.invoke(channels.CHANNELS.GET_ALL),
	getChannelById: (id: string) => ipcRenderer.invoke(channels.CHANNELS.GET, id),
	createChannel: (channel: Channel) => ipcRenderer.send(channels.CHANNELS.CREATE, channel),
	deleteChannel: (id: string) => ipcRenderer.send(channels.CHANNELS.DELETE, id),
	onChannelCreate: (callback: (channel: Channel) => void) => ipcRenderer.on(channels.CHANNELS.ON_CREATE, (_, channel) => callback(channel)),
	onChannelChange: (callback: (channel: Channel) => void) => ipcRenderer.on(channels.CHANNELS.ON_CHANGE, (_, channel) => callback(channel)),
	onChannelDelete: (callback: (channel: Channel) => void) => ipcRenderer.on(channels.CHANNELS.ON_DELETE, (_, channel) => callback(channel)),

	getMessageByChannelId: (channelId: string, limit: number, offset: number) => ipcRenderer.send(channels.MESSAGES.GET, channelId, limit, offset),
	sendMessage: (channelId: string, content: string) => ipcRenderer.send(channels.MESSAGES.SEND, channelId, content),
	onMessageReceive: (callback: (channelId: string, message: Message) => void) => ipcRenderer.on(channels.MESSAGES.ON_RECEIVE, (_, channelId, message) => callback(channelId, message)),
	onMessageSent: (callback: (channelId: string, message: Message) => void) => ipcRenderer.on(channels.MESSAGES.ON_SENT, (_, channelId, message) => callback(channelId, message)),

	getAllContacts: () => ipcRenderer.invoke(channels.CONTACTS.GET_ALL),
	getContactById: (id: string) => ipcRenderer.invoke(channels.CONTACTS.GET, id),
	createContact: (contact: User) => ipcRenderer.send(channels.CONTACTS.CREATE, contact),
	deleteContactById: (id: string) => ipcRenderer.send(channels.CONTACTS.DELETE, id),
	onContactChange: (callback: (contact: User) => void) => ipcRenderer.on(channels.CONTACTS.ON_CHANGE, (_, contact) => callback(contact)),
	onContactCreate: (callback: (contact: User) => void) => ipcRenderer.on(channels.CONTACTS.ON_CREATE, (_, contact) => callback(contact)),
	onContactDelete: (callback: (contact: User) => void) => ipcRenderer.on(channels.CONTACTS.ON_DELETE, (_, contact) => callback(contact)),
})
