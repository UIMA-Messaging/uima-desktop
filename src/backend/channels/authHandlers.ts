import { ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { Registration, LoginCredentials } from '../../common/types'
import { authentication } from '../main'

ipcMain.on(channels.REGISTER, async (event, registration: Registration) => {
  try {
    await authentication.register(registration)
    event.sender.send(channels.IS_REGISTERED, authentication.hasRegistered())
    event.sender.send(channels.IS_AUTHED, authentication.isAuthed())
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
  event.sender.send(channels.IS_AUTHED, authentication.isAuthed())
})

ipcMain.on(channels.LOGOUT, (event) => {
  authentication.logout()
  event.sender.send(channels.IS_AUTHED, authentication.isAuthed())
})

ipcMain.handle(channels.IS_REGISTERED, () => {
  return authentication.hasRegistered()
})

ipcMain.handle(channels.IS_AUTHED, () => {
  return authentication.isAuthed()
})
