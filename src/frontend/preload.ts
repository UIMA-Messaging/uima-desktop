import { channels } from '../common/constants'
import { LoginCredentials, Registration, Message } from '../common/types'
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  register: (registration: Registration) => ipcRenderer.send(channels.REGISTER, registration),
  login: (credentials: LoginCredentials) => ipcRenderer.send(channels.LOGIN, credentials),
  logout: () => ipcRenderer.send(channels.LOGOUT),
  onAuthChange: (callback: (event: IpcRendererEvent, state: boolean) => void) => ipcRenderer.on(channels.IS_AUTHED, callback),
  onRegistrationChange: (callback: (event: IpcRendererEvent, state: boolean) => void) => ipcRenderer.on(channels.IS_REGISTERED, callback),
  isAuthed: () => ipcRenderer.invoke(channels.IS_AUTHED),
  isRegistered: () => ipcRenderer.invoke(channels.IS_REGISTERED),
  fetchProfile: () => ipcRenderer.invoke(channels.USER_PROFILE),
  onLoginError: (callback: (event: IpcRendererEvent, error: string) => void) => ipcRenderer.on(channels.LOGIN_ERROR, callback),
  onRegistrationError: (callback: (event: IpcRendererEvent, error: string) => void) => ipcRenderer.on(channels.REGISTRATION_ERROR, callback),
  isOnline: () => ipcRenderer.invoke(channels.XMP_IS_CONNECTED),
  onOnline: (callback: (event: IpcRendererEvent, isOnline: boolean) => void) => ipcRenderer.on(channels.XMP_IS_CONNECTED, callback),
  sendMessage: (message: Message) => ipcRenderer.send(channels.SEND_MESSAGE, message),
  onMessageReceive: (callback: (event: IpcRendererEvent, message: Message) => void) => ipcRenderer.on(channels.RECEIVE_MESSAGE, callback),
  onXmpError: (callback: (event: IpcRendererEvent, error: string) => void) => ipcRenderer.on(channels.XMP_ERROR, callback),
})
