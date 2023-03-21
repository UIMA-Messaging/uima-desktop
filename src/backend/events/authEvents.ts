import { Credentials, User } from '../../common/types'
import { data } from '../../common/constants'
import { notifyOfAuthState } from '../handlers/authHandlers'
import { authentication, ejabberd, stateManagement } from '../main'

authentication.on('onRegister', (user: User) => {
  stateManagement.setSensitive(data.USER_PROFILE, user) // test changes
})

authentication.on('onLogin', (credentials: Credentials) => {
  stateManagement.setEncryptionKey(credentials.password + credentials.username)
  ejabberd.connect(credentials.username, '123')
  notifyOfAuthState('loggedIn')
})

authentication.on('onLogout', () => {
  stateManagement.invalidateEncryptionKey()
  notifyOfAuthState('loggedOut')
  ejabberd.disconnect() // placed at the end?
})
