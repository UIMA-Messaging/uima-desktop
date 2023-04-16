import '../styles/Button.css'
import { ReactNode } from 'react'

export default ({ label, onClick, type = 'default' }: { label?: ReactNode; onClick?: () => void; type?: 'green' | 'red' | 'default' }) => {
	return (
		<button className={'button-container ' + type} onClick={() => (onClick ? onClick() : null)}>
			{label}
		</button>
	)
}
