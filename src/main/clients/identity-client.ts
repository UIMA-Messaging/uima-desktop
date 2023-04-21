import axios, { AxiosError } from 'axios'
import https from 'https'
import isDev from 'electron-is-dev'
import { ExchangeKeys } from '../../common/types/SigalProtocol'

const registerExchangeKeysBaseUrl = 'https://localhost:44317/keys/register/exchanges'

export async function registerExchangeKey(exchangeKeys: ExchangeKeys): Promise<void> {
	try {
		await axios.post(registerExchangeKeysBaseUrl, exchangeKeys, headers())
	} catch (error) {
		if (error instanceof AxiosError) {
			switch (error?.response?.status) {
				case 401:
					throw Error(`Client is not authorised to register keys.`)
				case 500:
					throw Error('Could not register keys as there was an internal server error.')
				default:
					console.log(JSON.stringify(error))
					throw Error('Could not register keys.')
			}
		} else {
			throw Error('Could not connect to identity services')
		}
	}
}

function headers() {
	return isDev ? { httpsAgent: new https.Agent({ rejectUnauthorized: false }) } : null
}
