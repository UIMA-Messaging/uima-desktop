import './styles/App.css'
import { useEffect, useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import Welcome from './components/Welcome'

export default function App() {
  const [authStatus, setAuthStatus] = useState<string>()
  const [isFirstTime, setIsFirstTime] = useState<boolean>()
  const [selectedChat, setSelectedChat] = useState(null)

  useEffect(() => {
    window.electron.isFirstTimeRunning().then(setIsFirstTime)
    window.electron.authenticationStatus().then(setAuthStatus)
  }, [])

  window.electron.onAuthenticationStatus((_, status) => setAuthStatus(status))

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
        </div>
      )
  }
}
