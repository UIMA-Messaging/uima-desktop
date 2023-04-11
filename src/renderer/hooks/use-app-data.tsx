import { useEffect } from 'react'

export default function useAppData<T>(key: string, initial?: any): [T, (state: T) => void] {
	let state: T = initial

	useEffect(() => {
		window.electron.getStoreData<T>(key).then(setState)
	}, [])

	window.electron.onStoreChanged((incomingKey, incomingValue) => {
		if (key === incomingKey) {
			state = incomingValue
		}
	})

	function setState(newValue: T) {
		window.electron.setStoreData(key, newValue).then((_) => (state = newValue))
	}

	return [state, setState]
}
