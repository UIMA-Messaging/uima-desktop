import '../styles/Sidebar.css'
import { useNavigate } from 'react-router-dom'
import { useChannels } from '../hooks/use-channels'
import Picture from './Picture'
import useAuth from '../hooks/use-auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSearch, faInfo } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faUser, faSearch, faInfo)

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
			<div className="sidebar-item sidebar-item-options" onClick={() => navigation('/contacts')}>
				<FontAwesomeIcon icon="user" />
			</div>
			<div className="sidebar-item sidebar-item-options" onClick={() => navigation('/search')}>
				<FontAwesomeIcon icon="search" />
			</div>
			<div className="sidebar-item sidebar-item-options" onClick={() => navigation('/about')}>
				<FontAwesomeIcon icon="info" />
			</div>
			{/* <div className="sidebar-item" onClick={() => navigation('/group')} /> */}
			<div className="sidebar-item-separator" />
			{channels.map((channel) => (
				<div key={channel.id} className="sidebar-item" onClick={() => navigation('/chat', { state: { id: channel.id } })}>
					<Picture image={channel.image} name={channel.name} />
				</div>
			))}
		</div>
	)
}
