import '../styles/Encryption.css'
import { User } from '../../common/types'

export default ({ user }: { user: User }) => {
	const fingerprint = JSON.parse(String(user.fingerprint)) as string[]

	return (
		<div className="encryption-container">
			<div className="fingerprint">
				{fingerprint?.map((num) => (
					<div key={num}>{num}</div>
				))}
			</div>
			<div className="encryption-encryption">
				<p>All messages between you and {user.displayName} are End-to-End Encrypted with the Signal Protocol. </p>
				<p>To validate that noone is intercepting messages, compare each other's fingerprint on the left in person.</p>
				<p>Nobody, including UIMA, can read the messages in this conversation.</p>
			</div>
		</div>
	)
}
