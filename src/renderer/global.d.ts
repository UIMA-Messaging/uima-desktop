import { Credentials, Registration, User, Message, Channel } from '../common/types'
import { IpcRendererEvent } from 'electron'

export declare global {
	interface Window {
		electron: {
			onOnline: (callback: (event: IpcRendererEvent, isOnline: boolean) => void) => void
			isOnline: () => Promise<boolean>
			sendMessage: (recipientJid: string, message: Message) => void
			onMessageReceive: (callback: (event: IpcRendererEvent, message: Message) => void) => void
			createChannel: (channel: Channel) => Promise<Channel>
			getChannels: () => Promise<Channel[]>
			getChannelConversation: (channelId: string) => Promise<Message[]>
			contactUser: (username: string) => Promise<User | string>
			
			onError: (callback: (type: string, message: string) => void) => void
			
			register: (registration: Registration) => Promise<void>
			login: (credentials: Credentials) => Promise<void>
			logout: () => void

			getAuthState: () => Promise<'notRegistered' | 'loggedOut' | 'loggedIn'>
			onAuthStateChange: (callback: (state: 'notRegistered' | 'loggedOut' | 'loggedIn') => void) => void

			getAppData: <T>(key: string) => Promise<T>
			setAppData: (key: string, value: any) => Promise<void>
			onAppDataChange: (callback: (key: string, value: any) => void) => void
		}
	}
}
