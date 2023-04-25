import '../styles/Register.css'
import { useForm } from 'react-hook-form'
import useAuth from '../hooks/use-auth'

export default () => {
	const { register: registerUser, error, loading } = useAuth()
	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
	} = useForm()

	return (
		<div className="registration-wrapper" style={loading ? { opacity: 0.5, pointerEvents: 'none' } : null}>
			<div>
				<h1>Registration</h1>
				<span>Looks like this is the first time you are running this app. Register a user and begin chating!</span>
				{error && <p className="registration-error">{error}</p>}
			</div>
			<form className="registration-form" onSubmit={handleSubmit(registerUser)}>
				{errors.username?.type === 'required' && <p className="validation-error">Username is required</p>}
				{errors.username?.type === 'maxLength' && <p className="validation-error">Username must cannot be longer than 20 characters</p>}
				<input type="text" placeholder="Enter a username" {...formRegister('username', { required: true, maxLength: 20 })} defaultValue="adminadmin" />
				{errors.password?.type === 'required' && <p className="validation-error">Password is required</p>}
				{errors.password?.type === 'minLength' && <p className="validation-error">Password must be at least 10 characters long</p>}
				<input type="password" placeholder="Enter a password" {...formRegister('password', { required: true, minLength: 10 })} defaultValue="adminadmin" />
				<input type="file" {...formRegister('image')} />
				<input type="submit" value="Register" />
			</form>
			<div className="registration-note">Please note that a user is tied to a device. Upon registration, your credentials will only be valid on this device.</div>
		</div>
	)
}
