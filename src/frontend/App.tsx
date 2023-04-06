import './styles/App.css'
import { useEffect, useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import Welcome from './components/Welcome'
import Notification from './components/Notification'
import { Channel } from '../common/types'
import { getAuthState, getChannels, getOnlineState, isAuthenticated, isFirstRun, isOnline } from './handlers/handlers'

export default function App() {
  const [authenticated, setAuthentication] = useState<string>()
  const [isFirstTime, setIsFirstTime] = useState<boolean>()
  const [selectedChannel, setSelectedChannel] = useState<Channel>()
  const [channels, setChannels] = useState<Channel[]>([])
  const [online, setOnline] = useState(false)

  useEffect(() => {
    isFirstRun().then(setIsFirstTime)
    getAuthState().then(setAuthentication)
    getOnlineState().then(setOnline)
  }, [])

  useEffect(() => {
    if (authenticated) {
      getChannels().then(setChannels)
    }
  }, [authenticated])

  isAuthenticated(setAuthentication)
  isOnline(setOnline)

  switch (authenticated) {
    case 'notRegistered':
      return <Register />
    case 'loggedOut':
      return <Login />
    case 'loggedIn':
      return (
        <div className="app-wrapper">
          <Sidebar channels={channels} onClick={setSelectedChannel} />
          {selectedChannel ? <Chat channel={selectedChannel} /> : <Welcome returning={isFirstTime} />}
          {online && <Notification text={'Connected to XMP'} type={'success'} />}
          {!online && <Notification text={'Diconnected from XMP'} type={'error'} />}
        </div>
      )
  }
}
