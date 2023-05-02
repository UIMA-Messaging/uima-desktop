import { Credentials, RegisteredUser, JabberUser } from '../../common/types'
import { authentication, ejabberd, appData, encryption, contacts } from '..'
import X3DH from '../security/x3dh'
import { getX3DH, setX3DH } from '../repos/encryption-persistence'

authentication.on('onRegister', async (user: RegisteredUser, credentials: Credentials, x3dh: X3DH) => {
	appData.setEncryptionKey(credentials.password + credentials.username)
	await appData.set('user.profile', JSON.stringify(user), true)
	await contacts.createOrUpdateContact({ ...user })
	const jabber: JabberUser = { username: user.jid, password: user.ephemeralPassword }
	await appData.set('xmp.credentials', JSON.stringify(jabber), true)
	await setX3DH(x3dh)
	appData.invalidate()
})

authentication.on('onLogin', async (credentials: Credentials) => {
	appData.setEncryptionKey(credentials.password + credentials.username)
	const x3dh = await getX3DH()
	encryption.setX3DH(x3dh)
	const jabber = await appData.get<JabberUser>('xmp.credentials')
	ejabberd.connect(jabber)
})

authentication.on('onLogout', () => {
	appData.invalidate()
	encryption.invalidate()
	ejabberd.disconnect()
})
