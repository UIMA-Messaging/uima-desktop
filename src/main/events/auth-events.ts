import { Credentials, RegisteredUser } from '../../common/types'
import { authentication, ejabberd, appData, encryption } from '..'
import X3DH from '../security/x3dh'
import { getX3DH, setX3DH } from '../repos/encryption-persistence'

authentication.on('onRegister', async (user: RegisteredUser, credentials: Credentials) => {
	appData.setEncryptionKey(credentials.password + credentials.username)
	await appData.set('user.profile', JSON.stringify(user), true)
	const jabber = ejabberd.createJabberUser(user.username, user.ephemeralPassword)
	await appData.set('xmp.credentials', JSON.stringify(jabber), true)
	await setX3DH(X3DH.init())
	appData.invalidate()
})

authentication.on('onLogin', async (credentials: Credentials) => {
	appData.setEncryptionKey(credentials.password + credentials.username)
	encryption.setX3DH(await getX3DH())
	// const jabber = await appData.get('xmp.credentials')
	// ejabberd.connect(JSON.parse(jabber))
})

authentication.on('onLogout', () => {
	appData.invalidate()
	encryption.invalidate()
	ejabberd.disconnect()
})
