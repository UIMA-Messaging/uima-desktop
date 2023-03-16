import { LoginCredentials, Registration, User, Message } from '../common/types'
import { IpcRendererEvent } from 'electron'

declare global {
  interface Window {
    electron: {
      isFirstTimeRunning: () => Promise<boolean>
      register: (registration: Registration) => Promise<void>
      login: (credentials: LoginCredentials) => Promise<void>
      logout: () => void
      isAuthenticated: () => Promise<boolean>
      isRegistered: () => Promise<boolean>
      onAuthentication: (callback: (event: IpcRendererEvent, isAuthed: boolean) => void) => void
      onRegsiteration: (callback: (event: IpcRendererEvent, isRegistered: boolean) => void) => void
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
