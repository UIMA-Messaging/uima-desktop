import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Credentials } from '../../common/types'
import '../styles/Register.css'
import useAuth from '../hooks/use-auth'

export default () => {
	const { login, error, loading } = useAuth()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	return (
		<div className="registration-wrapper" style={loading ? { opacity: 0.5, pointerEvents: 'none' } : null}>
			<div>
				<h1>Login</h1>
				<span>Login with your username and password.</span>
				{error && <p className="registration-error">{error}</p>}
			</div>
			<form className="registration-form" onSubmit={handleSubmit(login)}>
				{errors.username?.type === 'required' && <p className="validation-error">Username is required</p>}
				<input type="text" placeholder="Enter your username" {...register('username', { required: true })} defaultValue="greffgreff" />
				{errors.password?.type === 'required' && <p className="validation-error">Password is required</p>}
				<input type="password" placeholder="Enter your password" {...register('password', { required: true })} defaultValue="Gaojinglu80!" />
				<input type="submit" value="Login" />
			</form>
			<div className="registration-note">Please note that a user is tied to a device. Your credentials will only be valid on this device.</div>
		</div>
	)
}
