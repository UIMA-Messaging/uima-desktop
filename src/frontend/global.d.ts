import { LoginCredentials, Registration, User, Message } from '../common/types'
import { IpcRendererEvent } from 'electron'

declare global {
  interface Window {
    electron: {
      isFirstTimeRunning: () => Promise<boolean>
      register: (registration: Registration) => Promise<void>
      login: (credentials: LoginCredentials) => Promise<void>
      logout: () => void
      authenticationStatus: () => Promise<'notRegistered' | 'loggedOut' | 'loggedIn'>
      onAuthenticationStatus: (callback: (event: IpcRendererEvent, status: 'notRegistered' | 'loggedOut' | 'loggedIn') => void) => void
      onLoginError: (callback: (event: IpcRendererEvent, error: string) => void) => void
      onRegistrationError: (callback: (event: IpcRendererEvent, error: string) => void) => void
      fetchProfile: () => Promise<User>
      onOnline: (callback: (event: IpcRendererEvent, isOnline: boolean) => void) => void
      isOnline: () => Promise<boolean>
      sendMessage: (message: Message) => void
      onMessageReceive: (callback: (event: IpcRendererEvent, message: Message) => void) => void
      onXmpError: (callback: (event: IpcRendererEvent, error: string) => void) => void
    }
  }
}

export {}
