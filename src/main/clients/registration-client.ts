import axios, { AxiosRequestConfig } from 'axios'
import { BasicUser, RegisteredUser, User } from '../../common/types'
import https from 'https'
import isDev from 'electron-is-dev'
import { AxiosError } from 'axios'

export async function register(user: BasicUser, token: string): Promise<RegisteredUser> {
	try {
		const url = process.env.REGISTRATION_SERVICE_BASE_URL + '/users/register/'
		const res = await axios.post(url, user, configuration(token))
		return res.data
	} catch (error) {
		if (error instanceof AxiosError) {
			switch (error?.response?.status) {
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
	try {
		const url = process.env.REGISTRATION_SERVICE_BASE_URL + '/users/unregister/'
		await axios.delete(url + user.id, configuration(token))
	} catch (error) {
		if (error instanceof AxiosError) {
			switch (error?.response?.status) {
				case 404:
					throw Error(`User not found.`)
				case 401:
					throw Error(`Client is not authorised to deregister new users.`)
				case 500:
					throw Error('Could not deregister user as there was an internal server error.')
				default:
					throw Error('Could not deregister user.')
			}
		} else {
			throw Error('Could not connect to registration services')
		}
	}
}

function configuration(token: string): AxiosRequestConfig {
	return {
		headers: { Authorization: `Bearer ${token}` },
		httpsAgent: new https.Agent({ rejectUnauthorized: !isDev }),
	}
}
