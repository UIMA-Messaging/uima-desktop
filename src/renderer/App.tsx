import "./styles/App.css";
import Login from './views/Login'
import Register from './views/Register'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuth from './hooks/use-auth'
import Chat from './views/Chat'
import Contacts from './views/Contacts'
import Settings from './views/Settings'
import Search from './views/Search'
import Group from './views/Group'

export default () => {
	const { state } = useAuth()
	const navigation = useNavigate()

	useEffect(() => {
		navigation(state)
	}, [state])

	return (
		<Routes>
			<Route path="/loggedOut" element={<Login />} />
			<Route path="/notRegistered" element={<Register />} />
			<Route path="/loggedIn" element={<Chat />} />
			<Route path="/group" element={<Group />} />
			<Route path="/contacts" element={<Contacts />} />
			<Route path="/settings" element={<Settings />} />
			<Route path="/search" element={<Search />} />
		</Routes>
	)
}
