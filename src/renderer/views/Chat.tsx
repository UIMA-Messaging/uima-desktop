import '../styles/Chat.css'
import ChatBubble from '../components/ChatBubble'
import Input from '../components/Input'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Message } from 'react-hook-form'

export default () => {
	const [messages, setMessages] = useState<Message[]>([])
	const bottom = useRef(null)
	const navigation = useNavigate()

	useEffect(() => {
		bottom.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	return (
		<div className="app-container">
			<Sidebar />
			<div className="chat-container">
				<div className="chat-header">
					<div className="chat-title">Group chat 1</div>
					<div className="chat-header-bread-crumbs">
						<span>group</span>
						<span>/</span>
						<span>1 online</span>
						<span>/</span>
						<span>active 5 minutes ago</span>
						<span>/</span>
						<span onClick={() => navigation('/group', { state: { id: '254625462456' } })}>
							<u style={{ cursor: 'pointer' }}>edit</u>
						</span>
					</div>
				</div>
				<div className="chat-messages">
					<div className="chat-greeting">Welcome to Group chat 1</div>
					<ChatBubble text="This is a message" time="12:12" author="Userngergqerame1" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<ChatBubble text="This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. " time="14:52" author="Username2" />
					<div ref={bottom} />
				</div>
				<div className="chat-inputs">
					<Input placeholder="Say something to Group chat 1" />
				</div>
			</div>
		</div>
	)
}
