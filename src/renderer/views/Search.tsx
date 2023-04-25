import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Page from '../components/Page'
import Input from '../components/Input'
import ContactCard from '../components/ContactCard'
import Button from '../components/Button'
import '../styles/Search.css'
import { SearchResults, User } from '../../common/types'
import { searchUserByName } from '../api/users'
import { createContact, useContacts } from '../hooks/use-contacts'

export default () => {
	const [users, setUsers] = useState<User[]>([])
	const [pageNumber, setPageNumber] = useState(0)
	const [query, setQuery] = useState('')
	const [isScrollAtBottom, setIsScrollAtBottom] = useState(false)
	const contacts = useContacts()

	useEffect(() => {
		if (isScrollAtBottom) {
			searchUserByName(query, 10, pageNumber + 1).then((search: SearchResults<User>) => {
				setUsers([...users, ...search.results])
				setPageNumber(pageNumber + 1)
			})
		}
	}, [isScrollAtBottom])

	useEffect(() => {
		if (query) {
			searchUserByName(query, 10, 0).then((search: SearchResults<User>) => {
				setUsers(search.results)
				setPageNumber(0)
			})
		}
	}, [query])

	function handleScroll(event: any) {
		const target = event.target
		const isScrollAtBottom = target.scrollTop + target.clientHeight === target.scrollHeight
		setIsScrollAtBottom(isScrollAtBottom)
	}

	return (
		<div className="app-container">
			<Sidebar />
			<Page title="Search someone">
				<div className="search-container">
					<Input placeholder="Search someone" getValue={setQuery} />
					<div onScroll={handleScroll}>
						{users?.map((user) => (
							<ContactCard key={user.id} username={user.username} displayName={user.displayName}>
								{contacts.filter((contact) => contact.id === user.id).length && <Button type="green" label="Add friend" onClick={async () => await createContact(user)} />}
							</ContactCard>
						))}
					</div>
				</div>
			</Page>
		</div>
	)
}
