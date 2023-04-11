import { Credentials, RegisteredUser, JabberUser, User } from '../../common/types'
import { data } from '../../common/constants'
import { notifyOfAuthState } from '../handlers/auth-handlers'
import { authentication, ejabberd, appData } from '../main'

authentication.on('onRegister', (user: RegisteredUser, credentials: Credentials) => {
	appData.setEncryptionKey(credentials.password + credentials.username)
	appData.set(data.USER_PROFILE, JSON.stringify(user), true)
	const jabber = ejabberd.createJabberUser(user.username, user.ephemeralPassword)
	appData.set(data.JABBER_USER, JSON.stringify(jabber), true)
	appData.invalidateEncryptionKey()
})

authentication.on('onLogin', async (credentials: Credentials) => {
	appData.setEncryptionKey(credentials.password + credentials.username)
	const jabber = await appData.get(data.JABBER_USER)
	ejabberd.connect(JSON.parse(jabber))
	notifyOfAuthState('loggedIn')
})

authentication.on('onLogout', () => {
	appData.invalidateEncryptionKey()
	notifyOfAuthState('loggedOut')
	ejabberd.disconnect() // placed at the end?
})
