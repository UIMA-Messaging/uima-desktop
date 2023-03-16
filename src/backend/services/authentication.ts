import Bcrypt from 'bcrypt'
import ElectronStore from 'electron-store'
import EventEmitter from 'events'
import { BasicUser, LoginCredentials, Registration } from '../../common/types'
import { data } from '../../common/constants'
import { register } from '../clients/identityClient'

export default class Authentification extends EventEmitter {
  private store: ElectronStore
  private authenticated: boolean
  private firstTimeRunning: boolean

  constructor(store: ElectronStore) {
    super()
    this.store = store
    this.authenticated = false
    this.firstTimeRunning = !!this.store.get(data.CHALLENGE)
    super.emit('onStartup', this.firstTimeRunning)
  }

  public async register(registration: Registration): Promise<void> {
    if (!!this.store.get(data.CHALLENGE)) {
      throw Error('A user has already been registered to this device.')
    }
    const credentials = {
      username: registration.username,
      password: registration.password,
    }
    const basicUser: BasicUser = {
      displayName: registration.username,
      image: registration.image,
    }
    const registeredUser = await register(basicUser)
    this.generateChallenge(credentials.password + credentials.username)
    this.login(credentials)
    super.emit('onRegister', credentials, registeredUser)
  }

  public login(credentials: LoginCredentials) {
    if (!this.store.get('challenge')) {
      throw Error('No challenge present. Cannot validated user credentials.')
    }
    if (this.authenticated) {
      throw Error('A user is already authenticated. User must first logout.')
    }
    const isValid = this.validateChallenge(credentials.password + credentials.username)
    if (!isValid) {
      throw Error('Username or password incorrect.')
    }
    this.authenticated = true
    super.emit('onLogin', credentials)
  }

  public logout() {
    if (!this.authenticated) {
      throw Error('No user authenticated. User must first login.')
    }
    this.authenticated = false
    super.emit('onLogout')
  }

  public isRegistered(): boolean {
    return !!this.store.get('challenge')
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
    if (!challenge) {
      throw Error('No challenge present to validated.')
    }
    return Bcrypt.hashSync(identity, salt) === challenge
  }
}
