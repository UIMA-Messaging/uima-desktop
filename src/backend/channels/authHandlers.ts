import { ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { Registration, LoginCredentials } from '../../common/types'
import { authentication, window } from '../main'

ipcMain.on(channels.REGISTER, async (event, registration: Registration) => {
  try {
    await authentication.register(registration)
  } catch (error) {
    event.sender.send(channels.REGISTRATION_ERROR, error.message)
  }
})

ipcMain.on(channels.LOGIN, (event, credentials: LoginCredentials) => {
  try {
    authentication.login(credentials)
  } catch (error) {
    event.sender.send(channels.LOGIN_ERROR, error.message)
  }
})

ipcMain.on(channels.LOGOUT, (event) => {
  try {
    authentication.logout()
  } catch (error) {
    event.sender.send(channels.LOGOUT_ERROR, error.message)
  }
})

ipcMain.handle(channels.IS_FIRST_TIME, (_) => {
  return authentication.isFirstTimeRunning()
})

ipcMain.handle(channels.ON_REGISTRATION, () => {
  return authentication.isRegistered()
})

ipcMain.handle(channels.ON_AUTHENTICATION, () => {
  return authentication.isAuthenticated()
})

export function notifyOfRegistration(registered: boolean) {
  window.webContents.send(channels.ON_REGISTRATION, registered)
}

export function notifyOfAuthentication(authenticated: boolean) {
  window.webContents.send(channels.ON_AUTHENTICATION, authenticated)
}
