import { useEffect } from 'react'
import { User } from '../../common/types'
import useAppData from '../hooks/use-app-data'

export default () => {
	const [profile, setProfile] = useAppData<User>('user.profile')

	useEffect(() => {
		if (profile) {
			profile.displayName = 'greffgreff#0001'
			setProfile(profile)
		}
	}, [profile])

	console.log(profile)

	return <img className="profile" src={profile?.image} onClick={window.electron.logout} />
}
