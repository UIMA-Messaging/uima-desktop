import { ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { Registration, Credentials } from '../../common/types'
import { authentication } from '../index'

ipcMain.on(channels.AUTH.REGISTER, async (event, registration: Registration) => {
	try {
		const authenticated = await authentication.register(registration)
		event.sender.send(channels.AUTH.STATE, authenticated ? 'loggedIn' : 'loggedOut')
	} catch (error) {
		event.sender.send(channels.ON_ERROR, 'auth.error', error.message)
	}
})

ipcMain.on(channels.AUTH.LOGIN, async (event, credentials: Credentials) => {
	try {
		const authenticated = await authentication.login(credentials)
		event.sender.send(channels.AUTH.STATE, authenticated ? 'loggedIn' : 'loggedOut')
	} catch (error) {
		event.sender.send(channels.ON_ERROR, 'auth.error', error.message)
	}
})

ipcMain.on(channels.AUTH.LOGOUT, (event) => {
	try {
		const authenticated = authentication.logout()
		event.sender.send(channels.AUTH.STATE, authenticated ? 'loggedIn' : 'loggedOut')
	} catch (error) {
		event.sender.send(channels.ON_ERROR, 'auth.error', error.message)
	}
})

ipcMain.handle(channels.AUTH.STATE, async () => {
	if (!(await authentication.isRegistered())) {
		return 'notRegistered'
	} else if (authentication.isAuthenticated()) {
		return 'loggedIn'
	} else {
		return 'loggedOut'
	}
})
