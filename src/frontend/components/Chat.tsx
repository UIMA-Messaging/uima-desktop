import '../styles/Chat.css'
import { useState, useRef, useEffect } from 'react'
import { Channel, Message } from '../../common/types'
import { v4 as uuid } from 'uuid'

export default function Chat({ channel }: { channel: Channel }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [palette, setPalette] = useState(null)
  const [isOnline, setIsOnline] = useState(false)
  const bottom = useRef(null)

  const channelId = '8077126b-048d-4e25-bd94-071b0d87a276'
  const recipient = 'admin@localhost'
  const self = 'greffgreff'

  useEffect(() => {
    // Vibrant.from(image).getPalette().then(setPalette).catch()
    window.electron.isOnline().then(setIsOnline)
    window.electron.getChannelConversation(channel.id).then(setMessages)
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
          sender: self,
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
          <img className="chat-user-picture" src={channel.image} />
          <div className="chat-user-name">{channel.name}</div>
        </div>
      </nav>
      <div className="chat-conversation">
        {messages.map((message) => (
          <div key={message.id} style={{ flexDirection: message.sender === self ? 'row-reverse' : 'row' }} className="chat-item-wrapper">
            <div className="chat-bubble">
              {/* <div style={{ color: m.sender !== "you" ? palette?.LightVibrant.hex : "inherit",  }} className="chat-bubble"> */}
              {message.content}
            </div>
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <footer className="chat-inputs">
        <input className="text-input" placeholder={`Chat with @${channel}`} onKeyDown={sendMessage} />
      </footer>
    </div>
  )
}
