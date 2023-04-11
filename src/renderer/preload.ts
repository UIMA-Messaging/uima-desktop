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
	contactUser: (username: string) => ipcRenderer.invoke(channels.CONTACT, username),

	onError: (callback: (type: string, message: string) => void) => ipcRenderer.on(channels.ON_ERROR, (_, type, message) => callback(type, message)),

	register: (registration: Registration) => ipcRenderer.send(channels.AUTH.REGISTER, registration),
	login: (credentials: Credentials) => ipcRenderer.send(channels.AUTH.LOGIN, credentials),
	logout: () => ipcRenderer.send(channels.AUTH.LOGOUT),

	getAuthState: () => ipcRenderer.invoke(channels.AUTH.STATE),
	onAuthStateChange: (callback: (state: 'notRegistered' | 'loggedOut' | 'loggedIn') => void) => ipcRenderer.on(channels.AUTH.STATE, (_, state) => callback(state)),

	getAppData: (key: string) => ipcRenderer.invoke(channels.APP_DATA.GET, key),
	setAppData: (key: string, value: any) => ipcRenderer.invoke(channels.APP_DATA.SET, key, value),
	onAppDataChange: (callback: (key: string, value: any) => void) => ipcRenderer.on(channels.APP_DATA.ON_CHANGE, (_, key, value) => callback(key, value)),
})
