import { useEffect, useState } from 'react'
import { Credentials, Registration, User } from '../../common/types'
import imageToUrl from '../utils/images'
import useAppError from './user-app-error'
import useAppData from './use-app-data'

interface AuthOptions {
	profile: User
	setProfile: (profile: User) => void
	loading: boolean
	state: 'notRegistered' | 'loggedOut' | 'loggedIn'
	register: (data: Registration) => void
	unregister: (credentials: Credentials) => void
	login: (credentials: Credentials) => void
	logout: () => void
	error: string
}

export default function useAuth(): AuthOptions {
	const [loading, setLoading] = useState(true)
	const [state, setState] = useState<'notRegistered' | 'loggedOut' | 'loggedIn'>()
	const { message: error } = useAppError('auth.error')
	const [profile, setProfile] = useAppData<User>('user.profile')

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

	async function unregister(credentials: Credentials) {
		window.electron.unregister(credentials)
	}

	return { profile, setProfile, loading, state, register, unregister, login, logout, error }
}
