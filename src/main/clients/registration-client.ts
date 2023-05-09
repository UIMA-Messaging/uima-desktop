import axios, { AxiosRequestConfig } from 'axios'
import { BasicUser, RegisteredUser, User } from '../../common/types'
import https from 'https'
import isDev from 'electron-is-dev'
import { AxiosError } from 'axios'

const baseRegister = process.env.REGISTRATION_SERVICE_BASE_URL + '/users/register/'
const baseUnregister = process.env.REGISTRATION_SERVICE_BASE_URL + '/users/unregister/'

export async function register(user: BasicUser, token: string): Promise<RegisteredUser> {
	try {
		const res = await axios.post(baseRegister, user, configure(token))
		return res.data
	} catch (error) {
		if (error instanceof AxiosError) {
			switch (error?.response?.status) {
				case 404:
					throw Error(`User with the same name already exists.`)
				case 400:
					throw Error(`Username already taken.`)
				case 401:
					throw Error(`Client is not authorised to register new users.`)
				case 500:
					throw Error('Could not register user as there was an internal server error.')
				default:
					throw Error('Could not register user.')
			}
		} else {
			throw Error('Could not connect to registration services')
		}
	}
}

export async function unregister(user: User, token: string): Promise<void> {
	await axios.delete(baseUnregister + user.id, configure(token))
}

function configure(token: string): AxiosRequestConfig {
	return {
		headers: { Authorization: `Bearer ${token}` },
		httpsAgent: new https.Agent({ rejectUnauthorized: !isDev }),
	}
}
