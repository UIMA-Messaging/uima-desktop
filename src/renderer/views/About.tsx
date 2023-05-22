import '../styles/About.css'
import Page from '../components/Page'
import Sidebar from '../components/Sidebar'

export default () => {
	return (
		<div className="app-container">
			<Sidebar />
			<Page title="About UIMA Encrytpion">
				<p>The Signal Protocol is a secure messaging protocol that ensures end-to-end encryption for private communication.</p>
				<p>It provides a way for two or more parties to securely exchange messages without them being intercepted or read by unauthorized entities. It achieves this by encrypting the messages in a way that only the intended recipients can decrypt them, guaranteeing privacy and confidentiality.</p>
				<p>A fingerprint is like a special code that helps you confirm someone's identity. It's like comparing secret handshakes or special symbols to be sure you're talking to the right friend and not an imposter.</p>
				<p>By checking and matching fingerprints, you can be confident that your messages are going to the intended person and not someone trying to snoop on your conversation. It's a way to make sure your chats stay private and secure.</p>
			</Page>
		</div>
	)
}
