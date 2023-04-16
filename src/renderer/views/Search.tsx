import React from 'react'
import Sidebar from '../components/Sidebar'
import Page from '../components/Page'
import Input from '../components/Input'
import ContactCard from '../components/ContactCard'
import Button from '../components/Button'
import '../styles/Search.css'

export default () => {
	return (
		<div className="app-container">
			<Sidebar />
			<Page title="Search someone">
				<div className="search-container">
					<Input placeholder="Search someone" />
					<div>
						<ContactCard username="usernergqergqame1#0001" displayName="Userqergqregname1" friendsSince={new Date()} online>
							<Button type="green" label="Add friend" />
						</ContactCard>
						<ContactCard username="username1#0001" displayName="Username1" friendsSince={new Date()} online>
							<Button type="green" label="Add friend" />
						</ContactCard>
						<ContactCard username="username1#0001" displayName="Username1" friendsSince={new Date()} online>
							<Button type="green" label="Add friend" />
						</ContactCard>
						<ContactCard username="username1#0001" displayName="Username1" friendsSince={new Date()} online>
							<Button type="green" label="Add friend" />
						</ContactCard>
						<ContactCard username="username1#0001" displayName="Username1" friendsSince={new Date()} online>
							<Button type="green" label="Add friend" />
						</ContactCard>
						<ContactCard username="username1#0001" displayName="Username1" friendsSince={new Date()} online>
							<Button type="green" label="Add friend" />
						</ContactCard>
					</div>
				</div>
			</Page>
		</div>
	)
}
