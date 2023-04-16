import '../styles/ChatBubble.css'

export default ({ text, author, time }: { text: string; author: string; time: string }) => {
	return (
		<div className="chat-bubble-container">
			<span className="message-time">{time}</span>
			<span className="message-author">{author}</span>
			<span className="message-text">{text}</span>
		</div>
	)
}
