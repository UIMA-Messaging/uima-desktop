import { Credentials, Registration, User, Message, Channel, SearchResults } from '../common/types'

export declare global {
	interface Window {
		electron: {
			getAppData: (key: string) => Promise<any>
			setAppData: (key: string, value: any) => Promise<void>
			onAppDataChange: (callback: (key: string, value: any) => void) => void

			onError: (callback: (type: string, message: string) => void) => void

			register: (registration: Registration) => Promise<void>
			login: (credentials: Credentials) => Promise<void>
			logout: () => void

			getAuthState: () => Promise<'notRegistered' | 'loggedOut' | 'loggedIn'>
			onAuthStateChange: (callback: (state: 'notRegistered' | 'loggedOut' | 'loggedIn') => void) => void

			onOnline: (callback: (isOnline: boolean) => void) => void
			isOnline: () => Promise<boolean>

			getAllChannels: () => Promise<Channel[]>
			getChannelById: (id: string) => Promise<Channel>
			createChannel: (channel: Channel) => Promise<void>
			deleteChannelById: (id: string) => Promise<void>
			onChannelCreate: (callback: (channel: Channel) => void) => void
			onChannelChange: (callback: (channel: Channel) => void) => void
			onChannelDelete: (callback: (channel: Channel) => void) => void

			getMessageByChannelId: (channelId: string, limit: number, offset: number) => Promise<Message[]>
			sendMessage: (channelId: string, content: string) => Promise<void>
			onMessageReceive: (callback: (channelId, message: Message) => void) => void
			onMessageSent: (callback: (channelId, message: Message) => void) => void

			getAllContacts: () => Promise<User[]>
			getContactById: (id: string) => Promise<User>
			createContact: (contact: User) => Promise<void>
			deleteContactById: (id: string) => Promise<void>
			onContactChange: (callback: (contact: User) => void) => void
			onContactCreate: (callback: (contact: User) => void) => void
			onContactDelete: (callback: (contact: User) => void) => void
		}
	}
}
