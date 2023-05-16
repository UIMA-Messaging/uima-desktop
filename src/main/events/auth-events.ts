import { authentication, appData, ejabberd } from '..'
import { RegisteredUser, JabberUser } from '../../common/types'

authentication.on('onRegister', async (user: RegisteredUser) => {
	const jabber: JabberUser = {
		username: user.jid,
		password: user.ephemeralPassword,
	}
	await appData.set('xmp.credentials', jabber, true)
})

authentication.on('onLogin', async () => {
	try {
		const jabber = await appData.get<JabberUser>('xmp.credentials')
		ejabberd.connect(jabber)
	} catch (error) {
		console.log('XMP client not connected:', error.message)
	}
})

authentication.on('onLogout', async () => {
	ejabberd.disconnect()
})
