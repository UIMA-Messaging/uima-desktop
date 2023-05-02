import './styles/App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuth from './hooks/use-auth'
import Login from './views/Login'
import Register from './views/Register'
import Chat from './views/Chat'
import Contacts from './views/Contacts'
import Settings from './views/Settings'
import Search from './views/Search'
import Group from './views/Group'

export default () => {
	const { state } = useAuth()
	const navigation = useNavigate()

	useEffect(() => {
		switch (state) {
			case 'loggedIn':
				navigation('contacts')
				break
			case 'loggedOut':
				navigation('login')
				break
			case 'notRegistered':
				navigation('register')
				break
		}
	}, [state])

	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/chat" element={<Chat />} />
			<Route path="/group" element={<Group />} />
			<Route path="/contacts" element={<Contacts />} />
			<Route path="/settings" element={<Settings />} />
			<Route path="/search" element={<Search />} />
		</Routes>
	)
}
