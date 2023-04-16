import '../styles/Group.css'
import Button from '../components/Button'
import Page from '../components/Page'
import Sidebar from '../components/Sidebar'
import Input from '../components/Input'
import ContactCard from '../components/ContactCard'
import { useLocation } from 'react-router-dom'

export default () => {
	const location = useLocation()

	return (
		<div className="app-container">
			<Sidebar />
			<Page title={location.state?.id ? 'Edit Group chat 1' : 'Create a group chat'}>
				<div className="group-container">
					<Input label={<b>Name you group chat</b>} placeholder="Something nice" />
					<Input label={<b>Invite some friends</b>} placeholder="Search among you friends" />
					<div className="group-contact-list">
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
					<span style={{ marginTop: '50px', display: 'flex', gap: '10px' }}>
						<Button label="Cancel" />
						<Button label="Create" type="green" />
					</span>
				</div>
			</Page>
		</div>
	)
}
