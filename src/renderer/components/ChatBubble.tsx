import '../styles/ChatBubble.css'
import { getNaturalTimeFromDate } from '../utils/time'
import { wordToHexColor } from '../utils/colors'

export default ({ text, author, timestamp }: { text: string; author: string; timestamp: any }) => {
	return (
		<div className="chat-bubble-container">
			<span className="message-author" style={{ color: wordToHexColor(author) }}>
				{author}
			</span>
			<span className="message-text">
				{text}
				<span className="message-time">{getNaturalTimeFromDate(new Date(timestamp))}</span>
			</span>
		</div>
	)
}
