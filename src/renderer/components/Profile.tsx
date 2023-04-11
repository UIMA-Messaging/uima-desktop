import { User } from '../../common/types'
import useAppData from '../hooks/use-app-data'

export default () => {
	const [profile, _] = useAppData<User>('user.profile')

	console.log(profile)

	return <img className="profile" src={profile?.image} onClick={window.electron.logout} />
}
