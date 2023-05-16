import '../styles/Sidebar.css'
import { useNavigate } from 'react-router-dom'
import { useChannels } from '../hooks/use-channels'
import Picture from './Picture'
import useAuth from '../hooks/use-auth'

export default () => {
	const navigation = useNavigate()
	const { channels } = useChannels()
	const { profile } = useAuth()

	return (
		<div className="sidebar">
			<div className="sidebar-item" onClick={() => navigation('/settings')}>
				<Picture image={profile?.image} name={profile?.username} />
			</div>
			<div className="sidebar-item-separator" />
			<div className="sidebar-item" onClick={() => navigation('/contacts')} />
			<div className="sidebar-item" onClick={() => navigation('/group')} />
			<div className="sidebar-item-separator" />
			{channels.map((channel) => (
				<div key={channel.id} className="sidebar-item" onClick={() => navigation('/chat', { state: { id: channel.id } })}>
					<Picture image={channel.image} name={channel.name} />
				</div>
			))}
		</div>
	)
}
