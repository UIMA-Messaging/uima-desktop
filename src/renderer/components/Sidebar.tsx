import '../styles/Sidebar.css'
import { useContacts } from '../hooks/use-contacts'
import { useNavigate } from 'react-router-dom'

export default () => {
	const navigation = useNavigate()
	const { contacts } = useContacts()

	return (
		<div className="sidebar">
			<div className="sidebar-item" onClick={() => navigation('/settings')} />
			<div className="sidebar-item-separator" />
			<div className="sidebar-item" onClick={() => navigation('/contacts')} />
			<div className="sidebar-item" onClick={() => navigation('/group')} />
			<div className="sidebar-item-separator" />
			{contacts.map((contact) => (
				<div key={contact.username} className="sidebar-item" onClick={() => navigation('/loggedIn', { replace: true, state: { type: 'dm', id: contact.id } })} />
			))}
		</div>
	)
}
