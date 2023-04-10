import axios from 'axios'
import { User } from '../../common/types'
import https from 'https'
import isDev from 'electron-is-dev'
import { AxiosError } from 'axios'

const baseContact = 'https://localhost:44354/contact/'

export async function contact(username: string): Promise<User> {
    try {
        const res = await axios.get(baseContact + encodeURIComponent(username), headers())
        return res.data
    } catch (error) {
        if (error instanceof AxiosError) {
            switch (error?.response?.status) {
                case 404:
                    throw Error(`User not found.`)
                case 401:
                    throw Error(`Client is not authorised to contact users.`)
                case 500:
                    throw Error('Could not contact user as there was an internal server error.')
                default:
                    throw Error('Could not contact user.')
            }
        } else {
            throw Error('Could not connect to contacting services')
        }
    }
}

function headers() {
    return isDev ? { httpsAgent: new https.Agent({ rejectUnauthorized: false }) } : null
}
