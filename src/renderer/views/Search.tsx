import '../styles/Search.css'
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Page from '../components/Page'
import Input from '../components/Input'
import ContactCard from '../components/ContactCard'
import Button from '../components/Button'
import { SearchResults, User } from '../../common/types'
import { searchUserByQuery } from '../api/users'
import { useContacts } from '../hooks/use-contacts'
import useAppError from '../hooks/user-app-error'
import useAuth from '../hooks/use-auth'

export default () => {
	const { profile } = useAuth()
	const [users, setUsers] = useState<User[]>([])
	const [pageNumber, setPageNumber] = useState(0)
	const [query, setQuery] = useState(null)
	const [isScrollAtBottom, setIsScrollAtBottom] = useState(false)
	const { created, changed, create: createContact } = useContacts()
	const [isContacting, setIsContacting] = useState(false)
	const { message } = useAppError('contacts.error')

	useEffect(() => {
		if (isScrollAtBottom) {
			searchUserByQuery(query, 10, pageNumber + 1).then((search: SearchResults<User>) => {
				const filteredResults = search.results.filter((user) => user.id !== profile.id)
				setUsers([...users, ...filteredResults])
				setPageNumber(pageNumber + 1)
			})
		}
	}, [isScrollAtBottom])

	useEffect(() => {
		if (query) {
			searchUserByQuery(query, 10, 0).then((search: SearchResults<User>) => {
				setUsers(search.results.filter((user) => user.id !== profile.id))
				setPageNumber(0)
			})
		}
	}, [query])

	useEffect(() => {
		setIsContacting(false)
	}, [created, changed, message])

	function handleScroll(event: any) {
		const target = event.target
		const isScrollAtBottom = target.scrollTop + target.clientHeight === target.scrollHeight
		setIsScrollAtBottom(isScrollAtBottom)
	}

	function handleAddFriend(user: User) {
		setIsContacting(true)
		createContact(user)
	}

	return (
		<div className="app-container">
			<Sidebar />
			<Page title="Search someone">
				<div className="search-container">
					<Input placeholder="Search someone" getValue={setQuery} />
					<p style={{ fontSize: '12px', color: 'red' }}>{message}</p>
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
