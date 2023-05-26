import { BasicUser, Credentials, Registration, Token, User } from '../../common/types'
import { register, unregister } from '../clients/registration-client'
import { createHash, randomBytes } from 'crypto'
import { getToken, isTokenValid } from '../clients/auth-client'
import EventEmitter from 'events'
import AppData from '../repos/app-data'
import X3DH from '../security/x3dh'
import { getX3DH, setX3DH } from '../repos/encryption-persistence'
import Encryption from './encryption'

export default class Authentification extends EventEmitter {
	private appData: AppData
	private authenticated: boolean
	private encryption: Encryption

	constructor(appData: AppData, encryption: Encryption) {
		super()

		this.appData = appData
		this.encryption = encryption
		this.authenticated = false
	}

	public async register(registration: Registration): Promise<boolean> {
		if (await this.isChallengePresent()) {
			throw Error('A user has already been registered to this device.')
		}

		const x3dh = X3DH.init(200)

		const basicUser: BasicUser = {
			displayName: registration.username,
			image: registration.image,
			exchangeKeys: x3dh.getExchangeKeys(),
		}

		const token = await getToken()

		const registeredUser = await register(basicUser, token.accessToken)

		const credentials: Credentials = {
			username: registration.username,
			password: registration.password,
		}
		await this.generateChallenge(credentials.password + credentials.username)

		this.appData.setEncryptionKey(() => {
			return AppData.defaultCipherStrategy({ ...credentials })
		})

		await setX3DH(x3dh)

		await this.appData.set('user.token', token, true)

		const user: User = {
			id: registeredUser.id,
			jid: registeredUser.jid,
			displayName: registeredUser.displayName,
			username: registeredUser.username,
			image: registeredUser.image,
			joinedAt: registeredUser.joinedAt,
		}

		await this.appData.set('user.profile', user, true)

		this.emit('onRegister', registeredUser)

		return await this.login(credentials)
	}

	public async unregister(credentials: Credentials): Promise<boolean> {
		if (!(await this.isChallengePresent())) {
			throw Error('No user is registered on this device.')
		}

		const token = await this.appData.get<Token>('user.token')

		if (!isTokenValid(token)) {
			return this.logout()
		}

		const user = await this.appData.get<User>('user.profile')

		await unregister(user, token.accessToken)

		await this.appData.erase(() => {
			return AppData.defaultCipherStrategy({ ...credentials })
		})

		this.emit('onDeregister', user)

		return this.logout()
	}

	public async login(credentials: Credentials): Promise<boolean> {
		if (this.authenticated) {
			throw Error('A user is already logged out.')
		}

		if (!(await this.isChallengePresent())) {
			throw Error('No challenge present. Cannot validated user credentials.')
		}

		this.authenticated = await this.validateChallenge(credentials.password + credentials.username)

		if (!this.authenticated) {
			throw Error('Username or password incorrect.')
		}

		this.appData.setEncryptionKey(() => {
			return AppData.defaultCipherStrategy({ ...credentials })
		})

		try {
			const x3dh = await getX3DH()
			this.encryption.setX3DH(x3dh)
		} catch (error) {
			console.log('X3DH not configured for encryption:', error.message)
		}

		const token = await this.appData.get<Token>('user.token')

		if (!isTokenValid(token)) {
			await this.appData.set('user.token', await getToken(), true)
		}

		this.emit('onLogin')

		return this.authenticated
	}

	public logout(): boolean {
		if (!this.authenticated) {
			throw Error('No user authenticated. User must first login.')
		}

		this.authenticated = false

		this.appData.invalidate()
		this.encryption.invalidate()

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
