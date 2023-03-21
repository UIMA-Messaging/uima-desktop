import { ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { contact } from '../clients/contactClient'

ipcMain.handle(channels.CONTACT, async (event, username: string) => {
  try {
    return await contact(username)
  } catch (error) {
    return error.message
  }
})