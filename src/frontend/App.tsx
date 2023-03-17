import './styles/App.css'
import { useEffect, useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import Welcome from './components/Welcome'
import Notification from './components/Notification'
import { Channel } from '../common/types'

export default function App() {
  const [authStatus, setAuthStatus] = useState<string>()
  const [isFirstTime, setIsFirstTime] = useState<boolean>()
  const [selectedChannel, setSelectedChannel] = useState<Channel>()
  const [channels, setChannels] = useState<Channel[]>([])
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    window.electron.isFirstTimeRunning().then(setIsFirstTime)
    window.electron.authenticationStatus().then(setAuthStatus)
    window.electron.isOnline().then(setIsOnline)
  }, [])

  useEffect(() => {
    if (authStatus) {
      window.electron.getChannels().then(setChannels)
    }
  }, [authStatus])

  window.electron.onAuthenticationStatus((_, status) => setAuthStatus(status))
  window.electron.onOnline((_, isOnline) => setIsOnline(isOnline))

  switch (authStatus) {
    case 'notRegistered':
      return <Register />
    case 'loggedOut':
      return <Login />
    case 'loggedIn':
      return (
        <div className="app-wrapper">
          <Sidebar channels={channels} onClick={setSelectedChannel} />
          {selectedChannel ? <Chat channel={selectedChannel} /> : <Welcome returning={isFirstTime} />}
          {isOnline && <Notification text={'Connected to XMP'} type={'success'} />}
          {!isOnline && <Notification text={'Diconnected from XMP'} type={'error'} />}
        </div>
      )
  }
}
