import '../styles/Sidebar.css'
import { useContacts } from '../hooks/use-contacts'
import { useNavigate } from 'react-router-dom'
import ProfilePicture from './ProfilePicture'
import useAppData from '../hooks/use-app-data'
import { User } from '../../common/types'

export default () => {
	const navigation = useNavigate()
	const { contacts } = useContacts()
	const [profile] = useAppData<User>('user.profile')

	return (
		<div className="sidebar">
			<div className="sidebar-item" onClick={() => navigation('/settings')}>
				<ProfilePicture image={profile?.image} name={profile?.displayName} />
			</div>
			<div className="sidebar-item-separator" />
			<div className="sidebar-item" onClick={() => navigation('/contacts')} />
			<div className="sidebar-item" onClick={() => navigation('/group')} />
			<div className="sidebar-item-separator" />
			{contacts.map((contact) => (
				<div key={contact.username} className="sidebar-item" onClick={() => navigation('/chat', { state: { type: 'dm', id: contact.id } })}>
					<ProfilePicture image={contact.image} name={contact.displayName} />
				</div>
			))}
		</div>
	)
}
