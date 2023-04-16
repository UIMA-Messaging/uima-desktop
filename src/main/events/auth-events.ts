import { Credentials, RegisteredUser } from '../../common/types'
import { authentication, ejabberd, appData, encryption } from '..'
import X3DH from '../security/x3dh'

authentication.on('onRegister', async (user: RegisteredUser, credentials: Credentials) => {
	appData.setEncryptionKey(credentials.password + credentials.username)
	await appData.set('user.profile', JSON.stringify(user), true)
	const jabber = ejabberd.createJabberUser(user.username, user.ephemeralPassword)
	await appData.set('xmp.credentials', JSON.stringify(jabber), true)
	const x3dh = X3DH.init()
	await appData.set('encryption.x3dh', x3dh, true)
	appData.invalidate()
})

authentication.on('onLogin', async (credentials: Credentials) => {
	appData.setEncryptionKey(credentials.password + credentials.username)
	const x3dh = await appData.get<X3DH>('encryption.x3dh')
	encryption.setX3DH(x3dh)
	// const jabber = await appData.get('xmp.credentials')
	// ejabberd.connect(JSON.parse(jabber))
})

authentication.on('onLogout', () => {
	appData.invalidate()
	encryption.invalidate()
	ejabberd.disconnect()
})
