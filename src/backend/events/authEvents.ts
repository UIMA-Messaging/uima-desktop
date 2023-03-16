import { data } from '../../common/constants'
import { notifyOfAuthentication, notifyOfRegistration } from '../channels/authHandlers'
import { authentication, stateManagement } from '../main'

authentication.on('onRegister', (credentials, user) => {
  stateManagement.setEncryptionKey(credentials.password + credentials.username) // create proper cypher strat
  stateManagement.setSensitive(data.USER_PROFILE, user)
  notifyOfRegistration(authentication.isRegistered())
})

authentication.on('onLogin', (credentials) => {
  stateManagement.setEncryptionKey(credentials.password + credentials.username)
  notifyOfAuthentication(authentication.isAuthenticated())
})

authentication.on('onLogout', () => {
  stateManagement.invalidateEncryptionKey()
  notifyOfAuthentication(authentication.isAuthenticated())
})
