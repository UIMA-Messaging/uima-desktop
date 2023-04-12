import { useEffect, useState } from 'react'

export default function useAppData<T>(key: string, initial?: any): [T | null, (state: T) => void] {
	const [state, setState] = useState<T>(initial)

	useEffect(() => {
		window.electron.getAppData<T>(key).then(setState)
	}, [state])

	window.electron.onAppDataChange((k, v) => k === key && setState(v))

	function updateState(newValue: T) {
		window.electron.setAppData(key, newValue)
	}

	return [state, updateState]
}
