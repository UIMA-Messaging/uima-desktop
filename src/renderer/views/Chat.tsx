import '../styles/Chat.css'
import ChatBubble from '../components/ChatBubble'
import Input from '../components/Input'
import Sidebar from '../components/Sidebar'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useContact } from '../hooks/use-contacts'
import { Message, User } from '../../common/types'
import useAppData from '../hooks/use-app-data'
import ColorHash from 'color-hash'
import ProfilePicture from '../components/ProfilePicture'

export default () => {
	const location = useLocation()
	const navigation = useNavigate()
	const contact = useContact(location.state?.id)
	const [profile] = useAppData<User>('user.profile')
	const [messages, setMessages] = useState<Message[]>([])
	const [type, setType] = useState(null)
	const [color, setColor] = useState(null)
	const bottom = useRef(null)

	useEffect(() => {
		setType(location.state?.type)
	}, [])

	useEffect(() => {
		if (contact) {
			const colorHash = new ColorHash()
			setColor(colorHash.hex(contact?.displayName))
		}
	}, [contact])

	useEffect(() => {
		bottom.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	function handleSendMessage(content: string) {
		if (!content) return
		const message: Message = {
			channelId: contact.id,
			sender: profile.id,
			receiver: contact.id,
			content: content,
			timestamp: new Date(),
		}
		window.electron.sendMessage('admin@localhost', message)
	}

	window.electron.onMessageReceive((message: Message) => {
		setMessages([...messages, message])
	})

	return (
		<div className="app-container">
			<Sidebar />
			<div className="chat-container">
				<div className="chat-header">
					<div className="chat-title">
						<div className="chat-header-picture">
							<ProfilePicture name={contact?.displayName} image={contact?.image} />
						</div>
						{contact?.displayName}
					</div>
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
					<ChatBubble text="This is a message" time="12:12" author={contact?.username} color={color} />
					<div ref={bottom} />
				</div>
				<div className="chat-inputs">
					<Input getValue={handleSendMessage} placeholder="Say something to Group chat 1" />
				</div>
			</div>
		</div>
	)
}
