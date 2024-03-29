import { useEffect, useState } from 'react'

export default function useAppData<T>(key: string, initial?: any): [T | null, (state: T) => void] {
	const [state, setState] = useState<T>(initial)

	useEffect(() => {
		window.electron.getAppData(key).then((v) => {
			try {
				setState(JSON.parse(v) as T)
			} catch {
				setState(v as T)
			}
		})
		window.electron.onAppDataChange((k, v) => {
			if (k === key && JSON.stringify(v) === JSON.stringify(state)) {
				try {
					setState(JSON.parse(v))
				} catch {
					setState(v)
				}
			}
		})
	}, [])

	function updateState(newValue: T) {
		window.electron.setAppData(key, newValue)
	}

	return [state, updateState]
}
