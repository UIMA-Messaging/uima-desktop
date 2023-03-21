import { ipcMain } from 'electron'
import { channels, data } from '../../common/constants'
import { stateManagement } from '../main'

ipcMain.handle(channels.USER_PROFILE, () => {
  return stateManagement.getSensitive(data.USER_PROFILE)
})
