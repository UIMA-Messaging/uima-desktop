import '../styles/Register.css'
import '../styles/Deregister.css'
import { useForm } from 'react-hook-form'
import useAuth from '../hooks/use-auth'
import Picture from '../components/Picture'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default () => {
	const { error, state, unregister, loading, profile } = useAuth()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const navigation = useNavigate()

	useEffect(() => {
		if (state !== 'loggedIn') {
			navigation('')
		}
	}, [])

	return (
		<div className="registration-wrapper" style={loading ? { opacity: 0.5, pointerEvents: 'none' } : null}>
			<div>
				<h1>Deregister</h1>
				<span>Please reenter your username and password.</span>
				<div className="deregister-profile">
					<Picture image={profile?.image} name={profile?.username} />
					{profile?.username}
				</div>
				{error && <p className="registration-error">{error}</p>}
			</div>
			<form className="registration-form" onSubmit={handleSubmit(unregister)}>
				{errors.username?.type === 'required' && <p className="validation-error">Username is required</p>}
				<input type="text" placeholder="Enter your username" {...register('username', { required: true })} />
				{errors.password?.type === 'required' && <p className="validation-error">Password is required</p>}
				<input type="password" placeholder="Enter your password" {...register('password', { required: true })} />
				<input type="submit" className="deregister-button" value="Deregister Account" />
				<input type="submit" className="cancel-button" value="Cancel" onClick={() => navigation('/settings')} />
			</form>
			<div className="registration-note">This action will destroy local data and delete your account in the system. This is irreversible.</div>
		</div>
	)
}
