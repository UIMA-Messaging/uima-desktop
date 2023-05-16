import { useState } from 'react'

export default function useAppError(type?: string) {
	const [message, setError] = useState(null)

	window.electron.onError((incomingType, incomingMessage) => {
		if (type) {
			if (type === incomingType && incomingMessage !== message) {
				setError(incomingMessage)
			} else {
				setError(null)
			}
		} else {
			setError(incomingMessage)
		}
	})

	return { message }
}
