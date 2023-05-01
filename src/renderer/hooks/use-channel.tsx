import { useEffect, useState } from 'react'
import { Channel, Message } from '../../common/types'

export default function useChannel(id: string): { messages: Message[]; sendMessage: (message: Message) => void } {
	const [channel, setChannel] = useState<Channel>()
	const [messages, setMessages] = useState<Message[]>()

	useEffect(() => {}, [])

	window.electron.onMessageReceive((message) => {
		setMessages([...messages, message])
	})

	window.electron.onMessageSent((message) => {
		setMessages([...messages, message])
	})

	function sendMessage(message: Message) {
		window.electron.sendMessage('', message)
	}

	return { messages, sendMessage }
}
