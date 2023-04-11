import { ipcMain } from 'electron'
import { channels, data } from '../../common/constants'
import { appData } from '..'

ipcMain.handle(channels.USER_PROFILE, () => {
	return appData.getSensitive(data.USER_PROFILE)
})
