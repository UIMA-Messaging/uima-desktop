import { Credentials, RegisteredUser, JabberUser, User } from '../../common/types'
import { data } from '../../common/constants'
import { notifyOfAuthState } from '../handlers/authHandlers'
import { authentication, ejabberd, stateManagement } from '../main'

authentication.on('onRegister', (user: RegisteredUser, credentials: Credentials) => {
  stateManagement.setEncryptionKey(credentials.password + credentials.username)
  stateManagement.setSensitive(data.USER_PROFILE, user)
  const jabber = ejabberd.formulateJabberUser(user.username, user.ephemeralPassword)
  console.log('jabber', jabber)
  stateManagement.setSensitive(data.JABBER_USER, jabber)
  stateManagement.invalidateEncryptionKey()
})

authentication.on('onLogin', (credentials: Credentials) => {
  stateManagement.setEncryptionKey(credentials.password + credentials.username)
  const jabber = stateManagement.getSensitive<JabberUser>(data.JABBER_USER)
  ejabberd.connect(jabber)
  notifyOfAuthState('loggedIn')
})

authentication.on('onLogout', () => {
  stateManagement.invalidateEncryptionKey()
  notifyOfAuthState('loggedOut')
  ejabberd.disconnect() // placed at the end?
})
