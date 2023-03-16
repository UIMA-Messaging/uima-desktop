import './styles/App.css'
import { useEffect, useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import Welcome from './components/Welcome'

export default function App() {
  const [isAuthed, setIsAuthed] = useState<boolean>()
  const [isFirstTime, setIsFirstTime] = useState<boolean>()
  const [isRegistered, setIsRegistered] = useState<boolean>()
  const [selectedChat, setSelectedChat] = useState(null)

  useEffect(() => {
    // combine all three into single `authenticationStatus` handler
    window.electron.isAuthenticated().then(setIsAuthed)
    window.electron.isRegistered().then(setIsRegistered)
    window.electron.isFirstTimeRunning().then(setIsFirstTime)
  }, [])

  // combine into single `onAuthenticationStatus` handler
  window.electron.onAuthentication((_, isAuthed) => setIsAuthed(isAuthed))
  window.electron.onRegsiteration((_, isRegistered) => setIsRegistered(isRegistered))

  if (!isRegistered) {
    return <Register />
  }

  if (!isAuthed) {
    return <Login />
  }

  return (
    <div className="app-wrapper">
      <Sidebar onClick={setSelectedChat} />
      {selectedChat ? <Chat chat={selectedChat} /> : <Welcome returning={isFirstTime} />}
    </div>
  )
}
