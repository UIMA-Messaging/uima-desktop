import Bcrypt from 'bcrypt'
import ElectronStore from 'electron-store'
import EventEmitter from 'events'
import { BasicUser, Credentials, Registration } from '../../common/types'
import { register } from '../clients/registrationClient'

export default class Authentification extends EventEmitter {
  private store: ElectronStore
  private authenticated: boolean
  private firstTimeRunning: boolean

  constructor(store: ElectronStore) {
    super()
    this.store = store
    this.authenticated = false
    this.firstTimeRunning = this.isChallengePresent()
  }

  public async register(registration: Registration): Promise<void> {
    if (this.isChallengePresent()) {
      throw Error('A user has already been registered to this device.')
    }
    const credentials: Credentials = { username: registration.username, password: registration.password }
    const basicUser: BasicUser = { displayName: registration.username, image: registration.image }
    const registeredUser = await register(basicUser)
    this.generateChallenge(credentials.password + credentials.username)
    this.login(credentials)
    this.emit('onRegister', registeredUser)
  }

  public login(credentials: Credentials) {
    if (this.authenticated) {
      throw Error('A user is already authenticated. User must first logout.')
    }
    if (!this.isChallengePresent()) {
      throw Error('No challenge present. Cannot validated user credentials.')
    }
    const isValid = this.validateChallenge(credentials.password + credentials.username)
    if (!isValid) {
      throw Error('Username or password incorrect.')
    }
    this.authenticated = true
    this.emit('onLogin', credentials)
  }

  public logout() {
    if (!this.authenticated) {
      throw Error('No user authenticated. User must first login.')
    }
    this.authenticated = false
    this.emit('onLogout')
  }

  private isChallengePresent(): boolean {
    return !!this.store.get('challenge')
  }

  public isRegistered(): boolean {
    return this.isChallengePresent()
  }

  public isAuthenticated(): boolean {
    return this.authenticated
  }

  public isFirstTimeRunning(): boolean {
    return this.firstTimeRunning
  }

  private generateChallenge(identity: string): void {
    const salt = Bcrypt.genSaltSync()
    const hash = Bcrypt.hashSync(identity, salt)
    this.store.set('salt', salt)
    this.store.set('challenge', hash)
  }

  private validateChallenge(identity: string): boolean {
    const salt = this.store.get('salt') as string
    const challenge = this.store.get('challenge') as string
    return Bcrypt.hashSync(identity, salt) === challenge
  }
}
