import { authentication, ejabberd, appData, encryption, contacts } from '..'
import { Credentials, RegisteredUser, JabberUser } from '../../common/types'
import { getX3DH, setX3DH } from '../repos/encryption-persistence'
import X3DH from '../security/x3dh'

authentication.on('onRegister', async (user: RegisteredUser, credentials: Credentials, x3dh: X3DH, token: string) => {
	await appData.set('user.token', token, true)
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
	try {
		const x3dh = await getX3DH()
		encryption.setX3DH(x3dh)
	} catch (error) {
		console.log('X3DH not configured for encryption:', error.message)
	}
	try {
		const jabber = await appData.get<JabberUser>('xmp.credentials')
		ejabberd.connect({ username: 'user1@localhost', password: '123' })
	} catch (error) {
		console.log('Ejabberd client not connected:', error.message)
	}
})

authentication.on('onLogout', () => {
	appData.invalidate()
	encryption.invalidate()
	ejabberd.disconnect()
})
