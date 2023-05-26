import axios, { AxiosError } from 'axios'
import { BasicUser, Token } from '../../common/types'
import { Agent } from 'https'
import isDev from 'electron-is-dev'

export async function getToken(user?: BasicUser): Promise<Token> {
	try {
		const url = process.env.GATEWAY_BASE_URL + '/api/auth/tokens/create'
		const res = await axios.post<Token>(url, user, configuration())
		const token = res.data
		token.creationDate = new Date()
		return token
	} catch (error) {
		if (error instanceof AxiosError) {
			switch (error?.response?.status) {
				case 401:
					throw Error(`Client is not authorised to fetch token.`)
				case 500:
					throw Error('Could not fetch token as there was an internal server error.')
				default:
					throw Error('Could not fetch token.')
			}
		} else {
			throw Error('Could not connect to authentication services')
		}
	}
}

function configuration() {
	return isDev ? { httpsAgent: new Agent({ rejectUnauthorized: false }) } : null
}

export function isTokenValid({ creationDate, expiresIn }: Token): boolean {
	const tokenExpiration = new Date(creationDate).getTime() + expiresIn * 1000
	const currentTime = new Date().getTime()
	return currentTime < tokenExpiration
}
