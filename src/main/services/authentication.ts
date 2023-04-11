import EventEmitter from 'events'
import { BasicUser, Credentials, RegisteredUser, Registration } from '../../common/types'
import { register } from '../clients/registration-client'
import StateManagement from '../repos/state-management'
import { v4 } from 'uuid'
import { createHash, randomBytes } from 'crypto'
import { channels } from '../main'

export default class Authentification extends EventEmitter {
	private appData: StateManagement
	private authenticated: boolean

	constructor(appData: StateManagement) {
		super()
		this.appData = appData
		this.authenticated = false
	}

	public async register(registration: Registration): Promise<void> {
		if (await this.isChallengePresent()) {
			throw Error('A user has already been registered to this device.')
		}
		const credentials: Credentials = { username: registration.username, password: registration.password }
		// const basicUser: BasicUser = { displayName: registration.username, image: registration.image }
		// const registeredUser = await register(basicUser)
		const registeredUser: RegisteredUser = {
			id: v4(),
			displayName: `${registration.username}#0001`,
			username: registration.username,
			image: null,
			ephemeralPassword: v4(),
			joinedAt: new Date(),
		}
		await this.generateChallenge(credentials.password + credentials.username)
		this.emit('onRegister', registeredUser, credentials)
		await this.login(credentials)
	}

	public async login(credentials: Credentials) {
		if (this.authenticated) {
			throw Error('A user is already authenticated. User must first logout.')
		}
		if (!(await this.isChallengePresent())) {
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

	private async isChallengePresent(): Promise<boolean> {
		return !!(await this.appData.get('auth.challenge'))
	}

	public async isRegistered(): Promise<boolean> {
		return await this.isChallengePresent()
	}

	public isAuthenticated(): boolean {
		return this.authenticated
	}

	private async generateChallenge(identity: string): Promise<void> {
		const salt = randomBytes(16).toString('hex')
		const hash = createHash('SHA256').update(identity).digest('hex')
		await this.appData.set('auth.salt', salt)
		await this.appData.set('auth.challenge', hash)
	}

	private async validateChallenge(identity: string): Promise<boolean> {
		console.log('VALIDATING USER')
		const salt = await this.appData.get('auth.salt')
		console.log('salt', salt)
		const challenge = await this.appData.get('auth.challenge')
		console.log('challenge', challenge)
		const hash = createHash('SHA256').update(identity).digest('hex')
		console.log('hash', hash)
		return hash === challenge
	}
}
