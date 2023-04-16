import '../styles/Sidebar.css'
import { useNavigate } from 'react-router-dom'

export default () => {
	const navigation = useNavigate()

	return (
		<div className="sidebar">
			<div className="sidebar-item" onClick={() => navigation('/settings')} />
			<div className="sidebar-item-separator" />
			<div className="sidebar-item" onClick={() => navigation('/contacts')} />
			<div className="sidebar-item" onClick={() => navigation('/group')} />
			<div className="sidebar-item-separator" />
			<div className="sidebar-item" onClick={() => navigation('/loggedIn', { state: { id: '254625462456' } })} />
			<div className="sidebar-item" onClick={() => navigation('/loggedIn', { state: { id: '245762467356865' } })} />
			<div className="sidebar-item" onClick={() => navigation('/loggedIn', { state: { id: '7649768365767' } })} />
			<div className="sidebar-item" onClick={() => navigation('/loggedIn', { state: { id: '765825465346' } })} />
			<div className="sidebar-item" onClick={() => navigation('/loggedIn', { state: { id: '4769367246256' } })} />
		</div>
	)
}
