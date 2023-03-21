import { data } from '../../common/constants'
import { notifyOfAuthState } from '../handlers/authHandlers'
import { authentication, ejabberd, stateManagement } from '../main'

authentication.on('onRegister', (user) => {
  stateManagement.setSensitive(data.USER_PROFILE, user) // test changes
})

authentication.on('onLogin', (credentials) => {
  stateManagement.setEncryptionKey(credentials.password + credentials.username)
  ejabberd.connect('username1@localhost', '123')
  notifyOfAuthState('loggedIn')
})

authentication.on('onLogout', () => {
  stateManagement.invalidateEncryptionKey()
  notifyOfAuthState('loggedOut')
  ejabberd.disconnect() // placed at the end?
})
