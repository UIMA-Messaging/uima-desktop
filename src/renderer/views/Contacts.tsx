import '../styles/Contacts.css'
import Page from '../components/Page'
import Input from '../components/Input'
import Button from '../components/Button'
import ContactCard from '../components/ContactCard'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { useContacts } from '../hooks/use-contacts'

export default () => {
	const navigation = useNavigate()
	const { contacts, remove } = useContacts()

	return (
		<div className="app-container">
			<Sidebar />
			<Page title="Your friends">
				<div className="contact-container">
					<Input placeholder="Search among friends" />
					<div className="search-someone-prompt">
						Cannot find a friend?
						<Button label="Search someone" type="green" onClick={() => navigation('/search')} />
					</div>
					<div className="contact-list-container">
						{contacts.map((user) => (
							<ContactCard key={user.id} username={user.username} displayName={user.displayName}>
								<Button type="red" label="Remove" onClick={() => remove(user.id)} />
							</ContactCard>
						))}
					</div>
				</div>
			</Page>
		</div>
	)
}
