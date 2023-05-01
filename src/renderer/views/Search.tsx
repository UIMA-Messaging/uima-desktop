import '../styles/Search.css'
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Page from '../components/Page'
import Input from '../components/Input'
import ContactCard from '../components/ContactCard'
import Button from '../components/Button'
import { SearchResults, User } from '../../common/types'
import { searchUserByQuery } from '../api/users'
import { createContact, useContacts } from '../hooks/use-contacts'

export default () => {
	const [users, setUsers] = useState<User[]>([])
	const [pageNumber, setPageNumber] = useState(0)
	const [query, setQuery] = useState('')
	const [isScrollAtBottom, setIsScrollAtBottom] = useState(false)
	const { created, changed } = useContacts()
	const [isContacting, setIsContacting] = useState(false)

	useEffect(() => {
		if (isScrollAtBottom) {
			searchUserByQuery(query, 10, pageNumber + 1).then((search: SearchResults<User>) => {
				setUsers([...users, ...search.results])
				setPageNumber(pageNumber + 1)
			})
		}
	}, [isScrollAtBottom])

	useEffect(() => {
		if (query) {
			searchUserByQuery(query, 10, 0).then((search: SearchResults<User>) => {
				setUsers(search.results)
				setPageNumber(0)
			})
		}
	}, [query])

	useEffect(() => {
		setIsContacting(false)
	}, [created, changed])

	function handleScroll(event: any) {
		const target = event.target
		const isScrollAtBottom = target.scrollTop + target.clientHeight === target.scrollHeight
		setIsScrollAtBottom(isScrollAtBottom)
	}

	async function handleAddFriend(user: User) {
		setIsContacting(true)
		await createContact(user)
	}

	return (
		<div className="app-container">
			<Sidebar />
			<Page title="Search someone">
				<div className="search-container">
					<Input placeholder="Search someone" getValue={setQuery} />
					<div style={isContacting ? { opacity: 0.5, pointerEvents: 'none' } : null} onScroll={handleScroll}>
						{users.map((user) => (
							<ContactCard key={user.id} username={user.username} displayName={user.displayName}>
								{<Button type="green" label="Add friend" onClick={async () => handleAddFriend(user)} />}
							</ContactCard>
						))}
					</div>
				</div>
			</Page>
		</div>
	)
}
