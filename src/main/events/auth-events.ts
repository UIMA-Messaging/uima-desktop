import { authentication, ejabberd, appData, encryption, contacts } from '..'
import { Credentials, RegisteredUser, JabberUser } from '../../common/types'
import AppData from '../repos/app-data'
import { getX3DH, setX3DH } from '../repos/encryption-persistence'
import X3DH from '../security/x3dh'

authentication.on('onRegister', async (user: RegisteredUser, credentials: Credentials, x3dh: X3DH, token: string) => {
	appData.setEncryptionKey(() => {
		return AppData.defaultCipherStrategy({ ...credentials })
	})

	await setX3DH(x3dh)

	await appData.set('user.token', token, true)
	await appData.set('user.profile', user, true)

	await contacts.createOrUpdateContact({ ...user })

	const jabber: JabberUser = {
		username: user.jid,
		password: user.ephemeralPassword,
	}
	await appData.set('xmp.credentials', jabber, true)
})

authentication.on('onLogin', async (credentials: Credentials) => {
	appData.setEncryptionKey(() => {
		return AppData.defaultCipherStrategy({ ...credentials })
	})

	try {
		const x3dh = await getX3DH()
		encryption.setX3DH(x3dh)
	} catch (error) {
		console.log('X3DH not configured for encryption:', error.message)
	}

	try {
		const jabber = await appData.get<JabberUser>('xmp.credentials')
		console.log(jabber)
		ejabberd.connect(jabber)
	} catch (error) {
		console.log('XMP client not connected:', error.message)
	}
})

authentication.on('onLogout', async () => {
	appData.invalidate()
	encryption.invalidate()
	ejabberd.disconnect()
})
