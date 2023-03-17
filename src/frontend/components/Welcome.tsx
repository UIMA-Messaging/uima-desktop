import '../styles/Welcome.css'
import Safe from '../assets/Safe'
import Rocket from '../assets/Rocket'
import Phone from '../assets/Phone'
import { useState, useEffect } from 'react'
import { User } from '../../common/types'

export default function Welcome({ returning }: { returning: boolean }) {
  const [profile, setProfile] = useState<User>()

  useEffect(() => {
    window.electron.getProfile().then(setProfile)
  }, [])

  return (
    <div>
      <h1 className="welcome-header">
        <div className="welcome">{returning ? 'Welcome back ' : 'Welcome'}</div>
        <div className="welcome-name">{profile?.displayName}</div>
      </h1>
      {returning && (
        <div className="hello-there">
          <div>
            <Safe />
            <h1>Secure</h1>
            <p>E2E encrypted messages using the Signal Protocol</p>
          </div>
          <div>
            <Rocket />
            <h1>Fast</h1>
            <p>Using fast and decentralized XMPP communication</p>
          </div>
          <div>
            <Phone />
            <h1>Intuitive</h1>
            <p>Familar design language we all expect for messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}
