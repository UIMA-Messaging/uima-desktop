import { useEffect, useState } from 'react'
import { Channel, Message } from '../../common/types'

export function useChannels(): { channels: Channel[]; created: Channel; removed: Channel; changed: Channel } {
	const [channels, setChannels] = useState<Channel[]>([])
	const [created, setCreated] = useState<Channel>(null)
	const [removed, setRemoved] = useState<Channel>(null)
	const [changed, setChanged] = useState<Channel>(null)

	useEffect(() => {
		window.electron.getAllChannels().then(setChannels)
	}, [])

	window.electron.onChannelChange((channel) => {
		const index = channels.findIndex((item) => item.id === channel.id)
		if (index !== -1) {
			channels[index] = channel
		}
		setChannels(channels)
		setChanged(channel)
	})

	window.electron.onChannelCreate((channel) => {
		setChannels([...channels, channel])
		setCreated(channel)
	})

	window.electron.onChannelDelete((channel) => {
		setChannels(channels.filter((item) => item.id !== channel.id))
		setRemoved(channel)
	})

	return { channels, created, removed, changed }
}

export function useChannel(id: string): { channel: Channel; messages: Message[]; sendMessage: (message: string) => void; loadNextMessages: () => void; newMessage: Message } {
	const [channel, setChannel] = useState<Channel>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [newMessage, setNewMessage] = useState<Message>(null)
	const [page, setPage] = useState(0)
	const [sent, setSent] = useState(0)

	useEffect(() => {
		setPage(0)
		setNewMessage(null)
		setSent(0)
		window.electron.getMessageByChannelId(id, 50, 0).then(setMessages)
		window.electron.getChannelById(id).then(setChannel)
	}, [id])

	window.electron.onChannelChange((changed) => {
		if (changed.id === id) {
			setChannel(changed)
		}
	})

	window.electron.onChannelCreate((created) => {
		if (created.id === id) {
			setChannel(created)
		}
	})

	window.electron.onChannelDelete((deleted) => {
		if (deleted.id === id) {
			setChannel(deleted)
		}
	})

	window.electron.onMessageReceive((channelId, message) => {
		if (channelId === id) {
			setMessages([message, ...messages.reverse()])
			setNewMessage(message)
			setSent(sent + 1)
		}
	})

	window.electron.onMessageSent((channelId, message) => {
		if (channelId === id) {
			setMessages([message, ...messages.reverse()])
			setNewMessage(message)
			setSent(sent + 1)
		}
	})

	function sendMessage(message: string) {
		if (message) {
			window.electron.sendMessage(channel.id, message)
		}
	}

	function loadNextMessages() {
		window.electron.getMessageByChannelId(id, 50, (page + 1) * 50 + sent).then((loaded) => {
			setPage(page + 1)
			setMessages([...messages.reverse(), ...loaded])
		})
	}

	return { channel, messages, sendMessage, loadNextMessages, newMessage }
}
