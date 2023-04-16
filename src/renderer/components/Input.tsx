import '../styles/Input.css'
import { KeyboardEvent, ReactNode, useRef } from 'react'

export default ({ label, placeholder, disabled, children, getValue }: { label?: ReactNode; placeholder?: string; disabled?: boolean; children?: ReactNode; getValue?: (text: string) => void }) => {
	const inputRef = useRef(null)

	function onClick() {
		if (getValue) {
			getValue(inputRef.current.value)
		}
	}

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (getValue && event.key === 'Enter') {
			getValue(inputRef.current.value)
		}
	}

	return (
		<div className="input-container">
			{label}
			{!children && <input className="input-container-input" ref={inputRef} style={{ opacity: disabled ? 0.6 : 1 }} placeholder={placeholder} disabled={disabled} onKeyDown={onKeyDown} onClick={onClick} />}
			{children}
		</div>
	)
}
