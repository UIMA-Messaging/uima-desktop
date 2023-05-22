import '../styles/Encryption.css'
import { User } from '../../common/types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default ({ user, showCiphers }: { user: User; showCiphers?: (toggle: boolean) => void }) => {
	const fingerprint = JSON.parse(String(user.fingerprint)) as string[]
	const [showing, show] = useState(false)
	const navigation = useNavigate()

	function handleShowCipher() {
		show(!showing)
		showCiphers(!showing)
	}

	return (
		<div className="encryption-container">
			<div className="fingerprint">
				{fingerprint?.map((num) => (
					<div key={num}>{num}</div>
				))}
			</div>
			<div className="encryption-description">
				<p>All messages between you and {user.displayName} are End-to-End Encrypted with the Signal Protocol.</p>
				<p>Nobody, including UIMA, can read the messages in this conversation.</p>
				<p>To validate that nobody is intercepting messages, compare each other's fingerprint on the left in person.</p>
				<p style={{ display: 'flex', gap: '5px' }}>
					<u onClick={() => navigation('/about')}>Read more about encryption</u>
					or
					<u onClick={handleShowCipher}>{showing ? 'Show plaintext' : 'Reveal message encryption'}</u>
				</p>
			</div>
		</div>
	)
}
