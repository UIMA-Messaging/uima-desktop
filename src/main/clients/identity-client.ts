import axios from 'axios'
import { User } from '../../common/types'
import https from 'https'
import isDev from 'electron-is-dev'
import { AxiosError } from 'axios'
import { SearchResults } from '../../common/types'

function headers() {
	return isDev ? { httpsAgent: new https.Agent({ rejectUnauthorized: false }) } : null
}
