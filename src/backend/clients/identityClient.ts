import axios from 'axios'
import { BasicUser, User } from '../../common/types'
import https from 'https'
import isDev from 'electron-is-dev'
import { AxiosError } from 'axios'

const baseRegister = 'https://localhost:44354/users/register/'
const baseUnregister = 'https://localhost:44354/users/unregister/'
const baseContact = 'https://localhost:44354/contact/'

export async function register(user: BasicUser): Promise<User> {
  try {
    const res = await axios.post(baseRegister, user, headers())
    return res.data
  } catch (error) {
    if (error instanceof AxiosError) {
      switch (error?.response?.status) {
        case 400:
          throw Error(`User with the same name already exists.`)
        case 401:
          throw Error(`Client is not authorised to register new users.`) // handle
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

export async function unregister(user: User): Promise<void> {
  await axios.delete(baseUnregister + user.id)
}

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
          throw Error(`Client is not authorised to contact users.`) // handle
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
