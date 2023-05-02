import { useEffect, useState } from 'react'
import '../styles/ChatBubble.css'
import ColorHash from 'color-hash'

export default ({ text, author, time }: { text: string; author: string; time: Date }) => {
	const [color, setColor] = useState(null) // use of useState herer is meh

	useEffect(() => {
		const colorHash = new ColorHash()
		setColor(colorHash.hex(author))
	}, [])

	return (
		<div className="chat-bubble-container">
			<span className="message-time">12:31</span>
			{/* <span className="message-time">{time?.toLocaleDateString()}</span> */}
			<span style={{ color: color }} className="message-author">
				{author}
			</span>
			<span className="message-text">{text}</span>
		</div>
	)
}
