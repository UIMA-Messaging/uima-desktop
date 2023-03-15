import { ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { Message } from '../../common/types'
import { ejabberd } from '../main'

ipcMain.on(channels.SEND_MESSAGE, (event, message: Message) => {
  try {
    ejabberd.send(message)
  } catch (error) {
    event.sender.send(channels.XMP_ERROR, error)
  }
})

ipcMain.on(channels.XMP_IS_CONNECTED, (event) => {
  event.sender.send(channels.XMP_IS_CONNECTED, ejabberd.isConnected())
})

ipcMain.handle(channels.XMP_IS_CONNECTED, (event) => {
  return ejabberd.isConnected()
})
