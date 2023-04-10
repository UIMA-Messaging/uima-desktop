import Bcrypt from 'bcrypt'
import EventEmitter from 'events'
import { BasicUser, Credentials, Registration } from '../../common/types'
import { register } from '../clients/registration-client'
import StateManagement from '../repos/state-management'

export default class Authentification extends EventEmitter {
  private appData: StateManagement
  private authenticated: boolean
  private firstTimeRunning: boolean

  constructor(appData: StateManagement) {
    super()
    this.appData = appData
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
    this.emit('onRegister', registeredUser, credentials)
    await this.login(credentials)
  }

  public async login(credentials: Credentials) {
    if (this.authenticated) {
      throw Error('A user is already authenticated. User must first logout.')
    }
    if (!this.isChallengePresent()) {
      throw Error('No challenge present. Cannot validated user credentials.')
    }
    const isValid = await this.validateChallenge(credentials.password + credentials.username)
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
    return !!this.appData.get('challenge')
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
    this.appData.set('salt', salt)
    this.appData.set('challenge', hash)
  }

  private async validateChallenge(identity: string): Promise<boolean> {
    const salt = await this.appData.get<string>('salt')
    const challenge = await this.appData.get<string>('challenge')
    return Bcrypt.hashSync(identity, salt) === challenge
  }
}
