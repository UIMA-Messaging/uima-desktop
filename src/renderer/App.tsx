import Login from './components/Login'
import Register from './components/Register'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import { useEffect } from 'react'
import useAuth from './hooks/use-auth'

export default () => {
	const { state } = useAuth()
	const navigation = useNavigate()

	useEffect(() => {
		navigation(state)
	}, [state])

	return (
		<Routes>
			<Route path="/" />
			<Route path="/notRegistered" element={<Register />} />
			<Route path="/loggedOut" element={<Login />} />
			<Route path="/loggedIn" element={<Dashboard />} />
		</Routes>
	)
}
