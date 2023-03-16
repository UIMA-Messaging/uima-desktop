import { ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { Message } from '../../common/types'
import { ejabberd, window } from '../main'

ipcMain.on(channels.SEND_MESSAGE, (event, message: Message) => {
  try {
    ejabberd.send(message)
  } catch (error) {
    event.sender.send(channels.XMP_ERROR, error)
  }
})

ipcMain.handle(channels.XMP_IS_CONNECTED, (_) => {
  return ejabberd.isConnected()
})

export function notifyOfStatus(isOnline: boolean) {
  window.webContents.send(channels.XMP_IS_CONNECTED, isOnline)
}

export function notifyOfMessage(message: Message) {
  window.webContents.send(channels.RECEIVE_MESSAGE, message)
}
