import { Credentials, RegisteredUser, JabberUser, User } from '../../common/types'
import { data } from '../../common/constants'
import { notifyOfAuthState } from '../handlers/auth-handlers'
import { authentication, ejabberd, appData } from '../main'

authentication.on('onRegister', (user: RegisteredUser, credentials: Credentials) => {
  appData.setEncryptionKey(credentials.password + credentials.username)
  appData.setSensitive(data.USER_PROFILE, user)
  const jabber = ejabberd.formulateJabberUser(user.username, user.ephemeralPassword)
  console.log('jabber', jabber)
  appData.setSensitive(data.JABBER_USER, jabber)
  appData.invalidateEncryptionKey()
})

authentication.on('onLogin', async (credentials: Credentials) => {
  appData.setEncryptionKey(credentials.password + credentials.username)
  const jabber = await appData.getSensitive<JabberUser>(data.JABBER_USER)
  ejabberd.connect(jabber)
  notifyOfAuthState('loggedIn')
})

authentication.on('onLogout', () => {
  appData.invalidateEncryptionKey()
  notifyOfAuthState('loggedOut')
  ejabberd.disconnect() // placed at the end?
})
