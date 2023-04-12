import { useEffect, useState } from 'react'

export default function useAppData<T>(key: string, initial?: any): [T, (state: T) => void] {
	const [state, setState] = useState<T>(initial)

	useEffect(() => {
		window.electron.getAppData<T>(key).then(setState)
	}, [])

	window.electron.onAppDataChange((k, value) => k === key && setState(value))

	function updateValue(newValue: T) {
		window.electron.setAppData(key, newValue)
	}

	return [state, updateValue]
}
