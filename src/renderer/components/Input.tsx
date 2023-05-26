import '../styles/Input.css'
import { KeyboardEvent, ReactNode, useRef } from 'react'

export default ({ label, placeholder, disabled, children, getValue }: { label?: ReactNode; placeholder?: string; disabled?: boolean; children?: ReactNode; getValue?: (text: string) => void }) => {
	const inputRef = useRef(null)

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (getValue && event.key === 'Enter') {
			getValue(inputRef.current.value)
			inputRef.current.value = ''
			inputRef.current.blur()
		}
	}

	return (
		<div className="input-container">
			{label}
			{!children && <input className="input-container-input" ref={inputRef} style={{ opacity: disabled ? 0.6 : 1 }} placeholder={placeholder} disabled={disabled} onKeyDown={onKeyDown} />}
			{children}
		</div>
	)
}
