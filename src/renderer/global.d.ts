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

			sendMessage: (recipientJid: string, message: Message) => Promise<void>
			onMessageReceive: (callback: (message: Message) => void) => void
		}
	}
}
