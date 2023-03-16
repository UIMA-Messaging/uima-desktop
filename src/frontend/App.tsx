import './styles/App.css'
import { useEffect, useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import Welcome from './components/Welcome'
import Notification from './components/Notification'

export default function App() {
  const [authStatus, setAuthStatus] = useState<string>()
  const [isFirstTime, setIsFirstTime] = useState<boolean>()
  const [selectedChat, setSelectedChat] = useState(null)
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    window.electron.isFirstTimeRunning().then(setIsFirstTime)
    window.electron.authenticationStatus().then(setAuthStatus)
    window.electron.isOnline().then(setIsOnline)
  }, [])

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
          <Sidebar onClick={setSelectedChat} />
          {selectedChat ? <Chat chat={selectedChat} /> : <Welcome returning={isFirstTime} />}
          <Notification text={isOnline ? 'Connected to XMP.' : 'Diconnected from XMP.'} type={isOnline ? 'success' : 'error'} />
        </div>
      )
  }
}
