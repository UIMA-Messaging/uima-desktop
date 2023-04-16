import { useState } from 'react'

export default function useAppError(type?: string) {
	const [message, setError] = useState(null)

	window.electron.onError((incomingType, incomingMessage) => {
		if (type) {
			type === incomingType ? setError(incomingMessage) : setError(null)
		} else {
			setError(incomingMessage)
		}
	})

	return { message }
}
