import { Credentials, RegisteredUser } from '../../common/types'
import { notifyOfAuthState } from '../handlers/auth-handlers'
import { authentication, ejabberd, appData } from '..'

authentication.on('onRegister', (user: RegisteredUser, credentials: Credentials) => {
	appData.setEncryptionKey(credentials.password + credentials.username)
	appData.set('user.profile', JSON.stringify(user), true)
	const jabber = ejabberd.createJabberUser(user.username, user.ephemeralPassword)
	appData.set('xmp.user', JSON.stringify(jabber), true)
	appData.invalidateEncryptionKey()
})

authentication.on('onLogin', async (credentials: Credentials) => {
	appData.setEncryptionKey(credentials.password + credentials.username)
	const jabber = await appData.get('xmp.user')
	ejabberd.connect(JSON.parse(jabber))
	notifyOfAuthState('loggedIn') // move to handler 
})

authentication.on('onLogout', () => {
	appData.invalidateEncryptionKey()
	notifyOfAuthState('loggedOut')
	ejabberd.disconnect() // placed at the end?
})
