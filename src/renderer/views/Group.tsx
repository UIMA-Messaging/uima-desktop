import '../styles/Group.css'
import Button from '../components/Button'
import Page from '../components/Page'
import Sidebar from '../components/Sidebar'
import Input from '../components/Input'
import ContactCard from '../components/ContactCard'
import { useLocation, useNavigate } from 'react-router-dom'
import { useContacts } from '../hooks/use-contacts'

export default () => {
	const navigatation = useNavigate()
	const location = useLocation()
	const { contacts } = useContacts()

	return (
		<div className="app-container">
			<Sidebar />
			<Page title={location.state?.id ? 'Edit Group chat 1' : 'Create a group chat'}>
				<div className="group-container">
					<Input label={<b>Name you group chat</b>} placeholder="Something nice" />
					<Input label={<b>Invite some friends</b>} placeholder="Search among you friends" />
					<div className="group-contact-list">
						{contacts.map((user) => (
							<ContactCard key={user.id} username={user.username} displayName={user.displayName}>
								<Button type="red" label="Remove" />
							</ContactCard>
						))}
					</div>
					<span style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
						<Button label="Cancel" onClick={() => navigatation('/loggedIn', { state: { id: location.state?.id } })} />
						<Button label="Create" type="green" />
					</span>
				</div>
			</Page>
		</div>
	)
}
