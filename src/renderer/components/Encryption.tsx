import '../styles/Encryption.css'
import { User } from '../../common/types'
import { useState } from 'react'

export default ({ user, showCiphers }: { user: User; showCiphers?: (toggle: boolean) => void }) => {
	const fingerprint = JSON.parse(String(user.fingerprint)) as string[]
	const [showing, show] = useState(false)

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
				<p>All messages between you and {user.displayName} are End-to-End Encrypted with the Signal Protocol. </p>
				<p>Nobody, including UIMA, can read the messages in this conversation.</p>
				<p>To validate that noone is intercepting messages, compare each other's fingerprint on the left in person.</p>
				<p>
					<u onClick={handleShowCipher}>{showing ? 'Show plaintext' : 'Reveal message encryption'}</u>
				</p>
			</div>
		</div>
	)
}
