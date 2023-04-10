import { Credentials, Registration, User, Message, Channel } from '../common/types'
import { IpcRendererEvent } from 'electron'

declare global {
    interface Window {
        electron: {
            isFirstTimeRunning: () => Promise<boolean>
            register: (registration: Registration) => Promise<void>
            login: (credentials: Credentials) => Promise<void>
            logout: () => void
            authenticationStatus: () => Promise<'notRegistered' | 'loggedOut' | 'loggedIn'>
            onAuthenticationStatus: (callback: (event: IpcRendererEvent, status: 'notRegistered' | 'loggedOut' | 'loggedIn') => void) => void
            onLoginError: (callback: (event: IpcRendererEvent, error: string) => void) => void
            onRegistrationError: (callback: (event: IpcRendererEvent, error: string) => void) => void
            getProfile: () => Promise<User> // change to use sql instead of electron store
            onOnline: (callback: (event: IpcRendererEvent, isOnline: boolean) => void) => void
            isOnline: () => Promise<boolean>
            sendMessage: (recipientJid: string, message: Message) => void
            onMessageReceive: (callback: (event: IpcRendererEvent, message: Message) => void) => void
            onXmpError: (callback: (event: IpcRendererEvent, error: string) => void) => void
            createChannel: (channel: Channel) => Promise<Channel>
            getChannels: () => Promise<Channel[]>
            getChannelConversation: (channelId: string) => Promise<Message[]>
            contactUser: (username: string) => Promise<User | string>
        }
    }
}

export {}
