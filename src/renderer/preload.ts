import { channels } from '../common/constants'
import { Credentials, Registration, Message, Channel } from '../common/types'
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('electron', {
	isOnline: () => ipcRenderer.invoke(channels.XMP_ONLINE),
	onOnline: (callback: (event: IpcRendererEvent, isOnline: boolean) => void) => ipcRenderer.on(channels.XMP_ONLINE, callback),
	sendMessage: (recipientJid: string, message: Message) => ipcRenderer.send(channels.SEND_MESSAGE, recipientJid, message),
	onMessageReceive: (callback: (event: IpcRendererEvent, message: Message) => void) => ipcRenderer.on(channels.RECEIVE_MESSAGE, callback),
	createChannel: (channel: Channel) => ipcRenderer.invoke(channels.CREATE_CHANNEL, channel),
	getChannels: () => ipcRenderer.invoke(channels.CHANNELS),
	getChannelConversation: (channelId: string) => ipcRenderer.invoke(channels.CONVERSATIONS, channelId),
	onXmpError: (callback: (type: string, message: string) => void) => ipcRenderer.on(channels.XMP_ERROR, (_, type, message) => callback(type, message)),
	contactUser: (username: string) => ipcRenderer.invoke(channels.CONTACT, username),
	
	onError: (callback: (type: string, message: string) => void) => ipcRenderer.on(channels.ON_ERROR, (_, type, message) => callback(type, message)),
	
	register: (registration: Registration) => ipcRenderer.send(channels.REGISTER, registration),
	login: (credentials: Credentials) => ipcRenderer.send(channels.LOGIN, credentials),
	logout: () => ipcRenderer.send(channels.LOGOUT),

	getAuthState: () => ipcRenderer.invoke(channels.AUTH_STATE),
	onAuthStateChange: (callback: (state: 'notRegistered' | 'loggedOut' | 'loggedIn') => void) => ipcRenderer.on(channels.AUTH_STATE, (_, state) => callback(state)),

	getStoreData: (key: string) => ipcRenderer.invoke(channels.STORE.GET, key),
	setStoreData: (key: string, value: any) => ipcRenderer.invoke(channels.STORE.SET, key, value),
	onStoreChanged: (callback: (key: string, value: any) => void) => ipcRenderer.on(channels.STORE.ON_CHANGE, (_, key, value) => callback(key, value)),
})
