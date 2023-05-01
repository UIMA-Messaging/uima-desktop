import '../styles/ChatBubble.css'

export default ({ text, author, time, color }: { text: string; author: string; time: string; color?: string }) => {
	return (
		<div className="chat-bubble-container">
			<span className="message-time">{time}</span>
			<span style={{ color }} className="message-author">
				{author}
			</span>
			<span className="message-text">{text}</span>
		</div>
	)
}
