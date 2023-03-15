import './styles/App.css'
import { useEffect, useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import Welcome from './components/Welcome'

export default function App() {
  const [isAuthed, setIsAuthed] = useState<boolean>()
  const [isRegistered, setIsRegistered] = useState<boolean>()
  const [selectedChat, setSelectedChat] = useState(null)

  useEffect(() => {
    window.electron.isAuthed().then(setIsAuthed)
    window.electron.isRegistered().then(setIsRegistered)
  }, [])

  window.electron.onAuthChange((_, isAuthed) => setIsAuthed(isAuthed))
  window.electron.onRegistrationChange((_, isRegistered) => setIsRegistered(isRegistered))

  if (!isRegistered) {
    return <Register />
  }

  if (!isAuthed) {
    return <Login />
  }

  return (
    isAuthed && (
      <div className="app-wrapper">
        <Sidebar onClick={setSelectedChat} />
        {selectedChat ? <Chat chat={selectedChat} /> : <Welcome />}
      </div>
    )
  )
}
