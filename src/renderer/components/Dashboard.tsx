import './../styles/App.css'
import Sidebar from './Sidebar'
import Chat from './Chat'
import Notification from './Notification'
import { useState, useEffect } from 'react'
import { Channel } from '../../common/types'

export default () => {
	const [selectedChannel, setSelectedChannel] = useState<Channel>()
	const [channels, setChannels] = useState<Channel[]>([])
	const [online, setOnline] = useState(false)

	// useEffect(() => {
	// 	getOnlineState().then(setOnline)
	// }, [])

	// isOnline(setOnline)

	return (
		<div className="app-wrapper">
			<Sidebar channels={channels} onClick={setSelectedChannel} />
			{selectedChannel && <Chat channel={selectedChannel} />}
			{online && <Notification text={'Connected to XMP'} type={'success'} />}
			{!online && <Notification text={'Diconnected from XMP'} type={'error'} />}
		</div>
	)
}
