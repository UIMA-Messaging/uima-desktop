import { ReactNode } from 'react'
import '../styles/ContactCard.css'

export default ({ image, username, displayName, online, friendsSince, children }: { image?: string; username: string; displayName: string; friendsSince?: Date; online?: boolean; children?: ReactNode }) => {
	return (
		<div className="contact-card-container">
			<img className="contact-card-image" src={image} />
			<div className="contact-card-meta-container">
				<div className="contact-card-credentials">
					<div className="contact-card-diplayname">{displayName}</div>
					<div className="contact-card-meta">{online ? 'online' : 'offline'}</div>
				</div>
				<div className="contact-card-username">{username}</div>
				<div className="contact-card-meta">{'Friends since ' + friendsSince.toLocaleString()}</div>
			</div>
			{children}
		</div>
	)
}
