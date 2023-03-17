import '../styles/Chat.css'
import { useState, useRef, useEffect } from 'react'
import { Message } from '../../common/types'
import { v4 as uuid } from 'uuid'

export default function Chat({ chat }: { chat: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [palette, setPalette] = useState(null)
  const [isOnline, setIsOnline] = useState(false)
  const bottom = useRef(null)

  const channelId = uuid()
  const recipient = 'admin@localhost'

  useEffect(() => {
    // Vibrant.from(image).getPalette().then(setPalette).catch()
    window.electron.isOnline().then(setIsOnline)
  }, [])

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  window.electron.onOnline((_, isOnline) => setIsOnline(isOnline))
  window.electron.onMessageReceive((_, message) => setMessages([...messages, message]))

  function sendMessage(event: any) {
    if (event.key == 'Enter') {
      if (event.target.value) {
        const newMessage: Message = {
          id: uuid(),
          channelId: channelId,
          sender: 'greffgreff',
          receiver: 'admin',
          content: event.target.value,
          timestamp: new Date(),
        }
        window.electron.sendMessage(recipient, newMessage)
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
          <div key={m.id} style={{ flexDirection: m.sender === 'greffgreff' ? 'row-reverse' : 'row' }} className="chat-item-wrapper">
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
    </div>
  )
}
