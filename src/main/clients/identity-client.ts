import axios, { AxiosError } from 'axios'
import https from 'https'
import isDev from 'electron-is-dev'
import { KeyBundle } from '../../common/types/SigalProtocol'

const registerExchangeKeysBaseUrl = 'https://localhost:44317/keys/bundle/'

export async function getKeyBundleForUser(from: string, to: string): Promise<KeyBundle> {
	try {
		const res = await axios.post(registerExchangeKeysBaseUrl + `${from}/${to}`, headers())
		return res.data
	} catch (error) {
		if (error instanceof AxiosError) {
			switch (error?.response?.status) {
				case 401:
					throw Error(`Client is not authorised to fetch key bundle.`)
				case 500:
					throw Error('Could not fetch key bundle as there was an internal server error.')
				default:
					console.log(JSON.stringify(error))
					throw Error('Could not fetch key bundle.')
			}
		} else {
			throw Error('Could not connect to identity services')
		}
	}
}

function headers() {
	return isDev ? { httpsAgent: new https.Agent({ rejectUnauthorized: false }) } : null
}
