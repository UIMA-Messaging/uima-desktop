import { useEffect, useState } from 'react'
import { Credentials, Registration } from '../../common/types'
import imageToUrl from '../api/images'
import useAppError from './user-app-error'

export default function useAuth() {
	const [loading, setLoading] = useState(true)
	const [state, setState] = useState<'notRegistered' | 'loggedOut' | 'loggedIn'>()
	const { message: error } = useAppError('auth.error')

	useEffect(() => {
		window.electron.getAuthState().then(setState)
		setLoading(false)
	}, [])

	useEffect(() => {
		setLoading(false)
	}, [error])

	window.electron.onAuthStateChange(setState)

	async function login(data: Credentials) {
		setLoading(true)
		window.electron.login(data)
	}

	function logout() {
		setLoading(true)
		window.electron.logout()
	}

	async function register(data: Registration) {
		setLoading(true)
		let imageUrl = null
		if (data.image[0]) {
			imageUrl = await imageToUrl(data.image[0])
		}
		window.electron.register({ ...data, image: imageUrl })
	}

	return { loading, state, register, login, logout, error }
}
