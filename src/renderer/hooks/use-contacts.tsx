import { useEffect, useState } from 'react'
import { User } from '../../common/types'

export async function createContact(contact: User) {
	await window.electron.createContact(contact)
}

export async function deleteContactByUsername(username: string) {
	await window.electron.deleteContactByUsername(username)
}

export function useContacts(): { contacts: User[]; created: User; removed: User; changed: User } {
	const [contacts, setContacts] = useState<User[]>([])
	const [created, setCreated] = useState<User>(null)
	const [removed, setRemoved] = useState<User>(null)
	const [changed, setChanged] = useState<User>(null)

	useEffect(() => {
		window.electron.getAllContacts().then(setContacts)
	}, [])

	window.electron.onContactChange((user) => {
		const index = contacts.findIndex((item) => item.username === user.username)
		if (index !== -1) {
			contacts[index] = user
		}
		setContacts(contacts)
		setChanged(user)
	})

	window.electron.onContactCreate((user) => {
		setContacts([...contacts, user])
		setCreated(user)
	})

	window.electron.onContactDelete((user) => {
		setContacts(contacts.filter((item) => item.username !== user.username))
		setRemoved(user)
	})

	return { contacts, created, removed, changed }
}

export function useContact(username: string): User {
	const [contact, setContact] = useState<User>(null)

	useEffect(() => {
		window.electron.getContactByUsername(username).then((user) => {
			setContact(user)
		})

		window.electron.onContactChange((user) => {
			if (username === user.username) {
				setContact(user)
			}
		})

		window.electron.onContactCreate((user) => {
			if (username === user.username) {
				setContact(user)
			}
		})

		window.electron.onContactDelete((user) => {
			if (username === user.username) {
				setContact(null)
			}
		})
	}, [])

	return contact
}
