import { useEffect, useState } from 'react'
import { User } from '../../common/types'

export async function createContact(contact: User) {
	await window.electron.createContact(contact)
}

export async function deleteContact(id: string) {
	await window.electron.deleteContact(id)
}

export function useContacts(): User[] {
	const [users, setUsers] = useState<User[]>([])

	useEffect(() => {
		window.electron.getAllContacts().then(setUsers)

		window.electron.onContactChange((user) => {
			const index = users.findIndex((item) => item.id === user.id)
			if (index !== -1) {
				users[index] = user
			}
			setUsers(users)
		})

		window.electron.onContactCreate((user) => {
			const index = users.findIndex((item) => item.id === user.id)
			if (index !== -1) {
				users[index] = user
			}
			setUsers(users)
		})

		window.electron.onContactDelete((user) => {
			setUsers(users.filter((item) => item.id !== user.id))
		})
	}, [])

	return users
}

export function useContact(id: string): User {
	const [user, setUser] = useState<User>(null)

	useEffect(() => {
		window.electron.getContactById(id).then(setUser)

		window.electron.onContactChange((user) => {
			if (id === user.id) {
				setUser(user)
			}
		})

		window.electron.onContactCreate((user) => {
			if (id === user.id) {
				setUser(user)
			}
		})

		window.electron.onContactDelete((user) => {
			if (id === user.id) {
				setUser(null)
			}
		})
	}, [])

	return user
}
