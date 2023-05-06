import { useEffect, useState } from 'react'
import { User } from '../../common/types'

export function useContacts(): { contacts: User[]; remove: (id: string) => void, create: (contact: User) => void, created: User; removed: User; changed: User } {
	const [contacts, setContacts] = useState<User[]>([])
	const [created, setCreated] = useState<User>(null)
	const [removed, setRemoved] = useState<User>(null)
	const [changed, setChanged] = useState<User>(null)

	useEffect(() => {
		window.electron.getAllContacts().then(setContacts)
	}, [])

	window.electron.onContactChange((changed) => {
		const index = contacts.findIndex((item) => item.id === changed.id)
		if (index !== -1) {
			contacts[index] = changed
		}
		setContacts(contacts)
		setChanged(changed)
	})

	window.electron.onContactCreate((created) => {
		setContacts([...contacts, created])
		setCreated(created)
	})

	window.electron.onContactDelete((deleted) => {
		setContacts(contacts.filter((item) => item.id !== deleted.id))
		setRemoved(deleted)
	})

	function create(contact: User) {
		window.electron.createContact(contact)
	}
	
	function remove(id: string) {
		window.electron.deleteContactById(id)
	}

	return { contacts, create, remove, created, removed, changed }
}

export function useContact(id: string): User {
	const [contact, setContact] = useState<User>(null)

	useEffect(() => {
		window.electron.getContactById(id).then((user) => {
			setContact(user)
		})
	}, [id])

	window.electron.onContactChange((changed) => {
		if (id === changed.id) {
			setContact(changed)
		}
	})

	window.electron.onContactCreate((created) => {
		if (id === created.id) {
			setContact(created)
		}
	})

	window.electron.onContactDelete((deleted) => {
		if (id === deleted.id) {
			setContact(null)
		}
	})

	return contact
}
