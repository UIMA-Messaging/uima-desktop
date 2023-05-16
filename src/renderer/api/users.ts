import axios from 'axios'
import { User } from '../../common/types'
import { AxiosError } from 'axios'
import { SearchResults } from '../../common/types'

export async function searchUserByQuery(query: string, count: number = 10, offset: number = 0): Promise<SearchResults<User>> {
	try {
		const url = process.env.IDENTITY_SERVICE_BASE_URL + '/users/search/'
		const res = await axios.get(url + query, { params: { count, offset } })
		return res.data
	} catch (error) {
		if (error instanceof AxiosError) {
			switch (error?.response?.status) {
				case 404:
					throw Error(`Users not found.`)
				case 401:
					throw Error(`Client is not authorised to search users.`)
				case 500:
					throw Error('Could not search users as there was an internal server error.')
				default:
					throw Error('Could not search users.')
			}
		} else {
			throw Error('Could not connect to identity services')
		}
	}
}
