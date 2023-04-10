import '../styles/Sidebar.css'
import AddContact from './AddContact'
import Profile from './Profile'
import { Channel } from '../../common/types'

export default function Sidebar({ onClick, channels }: { onClick: (channel: Channel) => void; channels: Channel[] }) {
  return (
    <div className="sidebar-wrapper">
      <Profile />
      <div className="sidebar-item-separator" />
      <AddContact />
      <div className="profile create-group-chat" />
      <div className="sidebar-item-separator" />
      {channels?.map((channel) => (
        <div className="profile" key={channel.id} onClick={() => onClick(channel)} />
      ))}
      <div
        className="profile"
        onClick={() =>
          onClick({
            id: '123',
            name: 'test channel',
          })
        }
      />
    </div>
  )
}
