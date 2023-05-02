import '../styles/Chat.css'
import ChatBubble from '../components/ChatBubble'
import Input from '../components/Input'
import Sidebar from '../components/Sidebar'
import ProfilePicture from '../components/ProfilePicture'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useChannel } from '../hooks/use-channels'

export default () => {
	const navigation = useNavigate()
	const location = useLocation()
	const { channel, messages, sendMessage } = useChannel(location.state?.id)
	const top = useRef(null)
	const bottom = useRef(null)

	useEffect(() => {
		bottom.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	console.log(channel, messages)

	return (
		<div className="app-container">
			<Sidebar />
			<div className="chat-container">
				<div className="chat-header">
					<div className="chat-title">
						<div className="chat-header-picture">
							<ProfilePicture name={channel?.name} image={channel?.image} />
						</div>
						{channel?.name}
					</div>
					<div className="chat-header-bread-crumbs">
						<span>{channel?.type === 'dm' ? 'direct messaging' : 'group chat'}</span>
						<span>/</span>
						<span>1 online</span>
						<span>/</span>
						<span>active 5 minutes ago</span>
						{channel?.type !== 'dm' && (
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
					<div className="chat-greeting">{channel?.type === 'dm' ? `Direct messages to ${channel?.members[0]?.displayName}` : `Welcome to ${channel?.name} group chat`}</div>
					<div ref={top} />
					{messages.map((message) => (
						<ChatBubble key={message.id} text={message.content} time={message.timestamp} author={message.author.displayName} />
					))}
					<div ref={bottom} />
				</div>
				<div className="chat-inputs">
					<Input getValue={sendMessage} placeholder="Say something..." />
				</div>
			</div>
		</div>
	)
}
