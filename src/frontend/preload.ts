import { channels } from '../common/constants'
import { LoginCredentials, Registration, Message } from '../common/types'
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  isFirstTimeRunning: () => ipcRenderer.invoke(channels.IS_FIRST_TIME),
  register: (registration: Registration) => ipcRenderer.send(channels.REGISTER, registration),
  login: (credentials: LoginCredentials) => ipcRenderer.send(channels.LOGIN, credentials),
  logout: () => ipcRenderer.send(channels.LOGOUT),
  isAuthenticated: () => ipcRenderer.invoke(channels.ON_AUTHENTICATION),
  isRegistered: () => ipcRenderer.invoke(channels.ON_REGISTRATION),
  onAuthentication: (callback: (event: IpcRendererEvent, state: boolean) => void) => ipcRenderer.on(channels.ON_AUTHENTICATION, callback),
  onRegsiteration: (callback: (event: IpcRendererEvent, state: boolean) => void) => ipcRenderer.on(channels.ON_REGISTRATION, callback),
  onLoginError: (callback: (event: IpcRendererEvent, error: string) => void) => ipcRenderer.on(channels.LOGIN_ERROR, callback),
  onRegistrationError: (callback: (event: IpcRendererEvent, error: string) => void) => ipcRenderer.on(channels.REGISTRATION_ERROR, callback),
  fetchProfile: () => ipcRenderer.invoke(channels.USER_PROFILE),
  isOnline: () => ipcRenderer.invoke(channels.XMP_IS_CONNECTED),
  onOnline: (callback: (event: IpcRendererEvent, isOnline: boolean) => void) => ipcRenderer.on(channels.XMP_IS_CONNECTED, callback),
  onXmpError: (callback: (event: IpcRendererEvent, error: string) => void) => ipcRenderer.on(channels.XMP_ERROR, callback),
  sendMessage: (message: Message) => ipcRenderer.send(channels.SEND_MESSAGE, message),
  onMessageReceive: (callback: (event: IpcRendererEvent, message: Message) => void) => ipcRenderer.on(channels.RECEIVE_MESSAGE, callback),
})
