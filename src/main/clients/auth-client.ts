import axios, { AxiosError } from 'axios'
import { BasicUser } from '../../common/types'
import { Agent } from 'https'
import isDev from 'electron-is-dev'

export async function getToken(user: BasicUser) {
	try {
		const url = process.env.AUTH_SERVICE_BASE_URL + '/tokens/create'
		const res = await axios.post(url, user, configuration())
		return res.data
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
