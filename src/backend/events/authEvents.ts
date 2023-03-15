import { data } from '../../common/constants'
import { authentication, stateManagement } from '../main'

authentication.on('onRegister', (credentials, user) => {
  stateManagement.setEncryptionKey(credentials.password + credentials.username) // create proper cypher strat
  stateManagement.setSensitive(data.USER_PROFILE, user)
})

authentication.on('onLogin', (credentials) => {
  stateManagement.setEncryptionKey(credentials.password + credentials.username)
})

authentication.on('onLogout', () => {
  stateManagement.invalidateEncryptionKey()
})
