import '../styles/Chat.css'
import ChatBubble from '../components/ChatBubble'
import Input from '../components/Input'
import Sidebar from '../components/Sidebar'
import Picture from '../components/Picture'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useChannel } from '../hooks/use-channels'
import Encryption from '../components/Encryption'

export default () => {
	const navigation = useNavigate()
	const { state } = useLocation()
	const { channel, messages, sendMessage, loadNextMessages, newMessage } = useChannel(state?.id)
	const bottom = useRef(null)
	const [showingCiphers, showCiphers] = useState(false)
	const [inputDisabled, setInputDisabled] = useState(false)

	useEffect(() => {
		bottom.current?.scrollIntoView({ behavior: 'smooth' })
	}, [newMessage])

	function handleScroll(event: any) {
		const target = event.target
		if (Math.round(-target.scrollTop) >= target.scrollHeight - target.clientHeight - 200) {
			loadNextMessages()
		}
	}

	function handleSendMessage(message: string) {
		setInputDisabled(true)

		sendMessage(message)

		setTimeout(() => {
			setInputDisabled(false)
		}, 200)
	}

	return (
		<div className="app-container">
			<Sidebar />
			<div className="chat-container">
				<div className="chat-header">
					<div className="chat-title">
						<div className="chat-header-picture">
							<Picture name={channel?.name} image={channel?.image} />
						</div>
						{channel?.name}
					</div>
					<div className="chat-header-bread-crumbs">
						{/* <span>{channel?.type === 'dm' ? 'direct messaging' : 'group chat'}</span> */}
						{/* <span>/</span> */}
						{/* <span>1 online</span> */}
						{/* <span>/</span> */}
						{/* <span>active 5 minutes ago</span> */}
						{/* {channel?.type !== 'dm' && (
							<>
								<span>/</span>
								<span onClick={() => navigation('/group', { state: { id: '254625462456' } })}>
									<u style={{ cursor: 'pointer' }}>edit</u>
								</span>
							</>
						)} */}
					</div>
				</div>
				<div className="chat-messages" onScroll={handleScroll}>
					<div ref={bottom} />
					{messages.map((message) => (
						<ChatBubble key={message.id} text={showingCiphers ? message.ciphertext : message.plaintext} timestamp={message.timestamp} author={message.author?.username} />
					))}
					{channel?.type === 'dm' && <Encryption user={channel?.members[0]} showCiphers={showCiphers} />}
					<div className="chat-greeting">{channel?.type === 'dm' ? `Direct messages to ${channel?.members[0]?.displayName}` : `Welcome to ${channel?.name} group chat`}</div>
				</div>
				<div className="chat-inputs">
					<Input getValue={handleSendMessage} placeholder="Say something..." disabled={inputDisabled} />
				</div>
			</div>
		</div>
	)
}
