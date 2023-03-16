import '../styles/Chat.css'
import { useState, useRef, useEffect } from 'react'
import { Message } from '../../common/types'
import Notification from './Notification'
import { v4 as uuid } from 'uuid'

export default function Chat({ chat }: { chat: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [palette, setPalette] = useState(null)
  const [isOnline, setIsOnline] = useState(false)
  const [xmpError, setXmpError] = useState(null)
  const bottom = useRef(null)

  useEffect(() => {
    // Vibrant.from(image).getPalette().then(setPalette).catch()
    window.electron.isOnline().then(setIsOnline)
  }, [])

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  window.electron.onXmpError((_, error) => setXmpError(error))
  window.electron.onOnline((_, isOnline) => setIsOnline(isOnline))
  window.electron.onMessageReceive((_, message) => setMessages([...messages, message]))

  function sendMessage(event: any) {
    if (event.key == 'Enter') {
      if (event.target.value) {
        const newMessage: Message = {
          id: uuid(),
          sender: 'you',
          receiver: 'admin@localhost',
          content: event.target.value,
          timestamp: new Date(),
        }
        window.electron.sendMessage(newMessage)
        setMessages([...messages, newMessage])
      }
      event.target.value = ''
    }
  }

  return (
    <div className="chat-wrapper" style={{ opacity: isOnline ? 1 : 0.7, pointerEvents: isOnline ? null : 'none' }}>
      <nav className="chat-header">
        <div className="chat-user">
          <img className="chat-user-picture" />
          <div className="chat-user-name">@{chat}</div>
        </div>
      </nav>
      <div className="chat-conversation">
        {messages.map((m) => (
          <div key={m.id} style={{ flexDirection: m.sender === 'you' ? 'row-reverse' : 'row' }} className="chat-item-wrapper">
            <div className="chat-bubble">
              {/* <div style={{ color: m.sender !== "you" ? palette?.LightVibrant.hex : "inherit",  }} className="chat-bubble"> */}
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <footer className="chat-inputs">
        <input className="text-input" placeholder={`Chat with @${chat}`} onKeyDown={sendMessage} />
      </footer>
      <Notification text={isOnline ? 'Connected to XMP.' : 'Diconnected from XMP.'} type={isOnline ? 'success' : 'error'} />
      {/* {xmpError && <Notification text={xmpError} type={'error'} />} */}
    </div>
  )
}
