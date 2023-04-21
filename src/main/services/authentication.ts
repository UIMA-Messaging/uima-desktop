import EventEmitter from 'events'
import { BasicUser, Credentials, RegisteredUser, Registration } from '../../common/types'
import { register } from '../clients/registration-client'
import AppData from '../repos/app-data'
import { createHash, randomBytes } from 'crypto'
import X3DH from '../security/x3dh'

export default class Authentification extends EventEmitter {
	private appData: AppData
	private authenticated: boolean

	constructor(appData: AppData) {
		super()
		this.appData = appData
		this.authenticated = false
	}

	public async register(registration: Registration): Promise<boolean> {
		if (await this.isChallengePresent()) {
			throw Error('A user has already been registered to this device.')
		}

		const basicUser: BasicUser = {
			displayName: registration.username,
			image: registration.image,
		}
		const registeredUser = await register(basicUser)

		// const registeredUser: RegisteredUser = {
		// 	id: v4(),
		// 	displayName: registration.username,
		// 	username: `${registration.username}#0001`,
		// 	image: null,
		// 	ephemeralPassword: v4(),
		// 	joinedAt: new Date(),
		// }

		const credentials: Credentials = {
			username: registration.username,
			password: registration.password,
		}
		await this.generateChallenge(credentials.password + credentials.username)

		const x3dh = X3DH.init(200)
		await 

		this.emit('onRegister', registeredUser, credentials, x3dh)
		return await this.login(credentials)
	}

	public async login(credentials: Credentials): Promise<boolean> {
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

		return this.authenticated
	}

	public logout(): boolean {
		if (!this.authenticated) {
			throw Error('No user authenticated. User must first login.')
		}

		this.authenticated = false

		this.emit('onLogout')

		return this.authenticated
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
		const hash = createHash('SHA256')
			.update(identity + salt)
			.digest('hex')
		await this.appData.set('auth.salt', salt)
		await this.appData.set('auth.challenge', hash)
	}

	private async validateChallenge(identity: string): Promise<boolean> {
		const salt = await this.appData.get('auth.salt')
		const challenge = await this.appData.get('auth.challenge')
		const hash = createHash('SHA256')
			.update(identity + salt)
			.digest('hex')
		return hash === challenge
	}
}
