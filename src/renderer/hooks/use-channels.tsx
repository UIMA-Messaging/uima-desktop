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

export function useChannel(id: string): { channel: Channel; messages: Message[]; sendMessage: (message: string) => void; loadNextMessages: () => void } {
	const [channel, setChannel] = useState<Channel>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [page, setPage] = useState(0)

	useEffect(() => {
		window.electron.getMessageByChannelId(id, 100, page).then(setMessages)
		window.electron.getChannelById(id).then(setChannel)
	}, [id])

	window.electron.onChannelChange((changed) => {
		if (changed.id === channel.id) {
			setChannel(changed)
		}
	})

	window.electron.onChannelCreate((created) => {
		if (created.id === channel.id) {
			setChannel(created)
		}
	})

	window.electron.onChannelDelete((deleted) => {
		if (deleted.id === channel.id) {
			setChannel(deleted)
		}
	})

	window.electron.onMessageReceive((message) => {
		setMessages([...messages, message])
	})

	window.electron.onMessageSent((message) => {
		setMessages([...messages, message])
	})

	function sendMessage(message: string) {
		if (message) {
			window.electron.sendMessage(channel.id, message)
		}
	}

	function loadNextMessages() {
		window.electron.getMessageByChannelId(id, 100, page + 1).then((loaded) => {
			setPage(page + 1)
			setMessages([...messages, ...loaded])
		})
	}

	return { channel, messages, sendMessage, loadNextMessages }
}
