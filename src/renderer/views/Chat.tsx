import '../styles/Chat.css'
import ChatBubble from '../components/ChatBubble'
import Input from '../components/Input'
import Sidebar from '../components/Sidebar'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Message } from 'react-hook-form'
import { useContact } from '../hooks/use-contacts'

export default () => {
	const location = useLocation()
	const contact = useContact(location.state?.id)
	const [messages, setMessages] = useState<Message[]>([])
	const [type, setType] = useState('')
	const navigation = useNavigate()
	const bottom = useRef(null)

	useEffect(() => {
		setType(location.state?.type)
	}, [])

	useEffect(() => {
		bottom.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	return (
		<div className="app-container">
			<Sidebar />
			<div className="chat-container">
				<div className="chat-header">
					<div className="chat-title">{contact?.displayName}</div>
					<div className="chat-header-bread-crumbs">
						<span>{type === 'dm' ? 'direct messaging' : 'group chat'}</span>
						<span>/</span>
						<span>1 online</span>
						<span>/</span>
						<span>active 5 minutes ago</span>
						{type !== 'dm' && (
							<>
								<span>/</span>
								<span onClick={() => navigation('/group', { state: { id: '254625462456' } })}>
									<u style={{ cursor: 'pointer' }}>edit</u>
								</span>
							</>
						)}
					</div>
				</div>
				<div className="chat-messages">
					<div className="chat-greeting">{type === 'dm' ? `Direct messages to ${contact?.displayName}` : `Welcome to ${'some name'} group chat`}</div>
					<ChatBubble text="This is a message" time="12:12" author={contact?.displayName} />
					<div ref={bottom} />
				</div>
				<div className="chat-inputs">
					<Input placeholder="Say something to Group chat 1" />
				</div>
			</div>
		</div>
	)
}
