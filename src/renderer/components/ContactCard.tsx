import { ReactNode } from 'react'
import '../styles/ContactCard.css'
import Picture from './Picture'

export default ({ image, username, displayName, online, joinedAt, children }: { image?: string; username: string; displayName: string; joinedAt?: Date; online?: boolean; children?: ReactNode }) => {
	return (
		<div className="contact-card-container">
			<div className="contact-card-image">
				<Picture image={image} name={username} />
			</div>
			<div className="contact-card-meta-container">
				<div className="contact-card-credentials">
					<div className="contact-card-diplayname">{displayName}</div>
					{online && <div className="contact-card-meta">{online ? 'online' : 'offline'}</div>}
				</div>
				<div className="contact-card-username">{username}</div>
				{joinedAt && <div className="contact-card-meta">{'Joined since ' + joinedAt.toLocaleString()}</div>}
			</div>
			{children}
		</div>
	)
}
