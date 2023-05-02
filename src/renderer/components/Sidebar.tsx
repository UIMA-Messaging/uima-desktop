import '../styles/Sidebar.css'
import { useNavigate } from 'react-router-dom'
import ProfilePicture from './ProfilePicture'
import { User } from '../../common/types'
import { useChannels } from '../hooks/use-channels'
import useAppData from '../hooks/use-app-data'

export default () => {
	const navigation = useNavigate()
	const { channels } = useChannels()
	const [profile] = useAppData<User>('user.profile')

	console.log(channels)

	return (
		<div className="sidebar">
			<div className="sidebar-item" onClick={() => navigation('/settings')}>
				<ProfilePicture image={profile?.image} name={profile?.displayName} />
			</div>
			<div className="sidebar-item-separator" />
			<div className="sidebar-item" onClick={() => navigation('/contacts')} />
			<div className="sidebar-item" onClick={() => navigation('/group')} />
			<div className="sidebar-item-separator" />
			{channels.map((channel) => (
				<div key={channel.id} className="sidebar-item" onClick={() => navigation('/chat', { state: { id: channel.id } })}>
					<ProfilePicture image={channel.image} name={channel.name} />
				</div>
			))}
		</div>
	)
}
