import { data } from '../../common/constants'
import { notifyOfAuthState } from '../channels/authHandlers'
import { authentication, stateManagement } from '../main'

authentication.on('onRegister', (user) => {
  stateManagement.setSensitive(data.USER_PROFILE, user) // test changes
})

authentication.on('onLogin', (credentials) => {
  stateManagement.setEncryptionKey(credentials.password + credentials.username)
  notifyOfAuthState('loggedIn')
})

authentication.on('onLogout', () => {
  stateManagement.invalidateEncryptionKey()
  notifyOfAuthState('loggedOut')
})
