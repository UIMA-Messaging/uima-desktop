import '../styles/Contacts.css'
import Page from '../components/Page'
import Input from '../components/Input'
import Button from '../components/Button'
import ContactCard from '../components/ContactCard'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'

export default () => {
	const navigation = useNavigate()

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
						<ContactCard username="usernergqergqame1#0001" displayName="Userqergqregname1" friendsSince={new Date()} online>
							<Button type="red" label="Remove" />
						</ContactCard>
						<ContactCard username="username1#0001" displayName="Username1" friendsSince={new Date()} online>
							<Button type="red" label="Remove" />
						</ContactCard>
						<ContactCard username="username1#0001" displayName="Username1" friendsSince={new Date()} online>
							<Button type="red" label="Remove" />
						</ContactCard>
						<ContactCard username="username1#0001" displayName="Username1" friendsSince={new Date()} online>
							<Button type="red" label="Remove" />
						</ContactCard>
						<ContactCard username="username1#0001" displayName="Username1" friendsSince={new Date()} online>
							<Button type="red" label="Remove" />
						</ContactCard>
						<ContactCard username="username1#0001" displayName="Username1" friendsSince={new Date()} online>
							<Button type="red" label="Remove" />
						</ContactCard>
					</div>
				</div>
			</Page>
		</div>
	)
}
