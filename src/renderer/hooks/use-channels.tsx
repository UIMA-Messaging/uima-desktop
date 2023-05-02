import { useEffect, useState } from 'react'
import { Channel, Message } from '../../common/types'

export function useChannels(): { channels: Channel[]; created: Channel; removed: Channel; changed: Channel } {
	const [channels, setChannels] = useState<Channel[]>()
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

export function useChannel(id: string): { channel: Channel; sendMessage: (message: string) => void } {
	const [channel, setChannel] = useState<Channel>()
	const [messages, setMessages] = useState<Message[]>()

	useEffect(() => {
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

	return { channel, sendMessage }
}
