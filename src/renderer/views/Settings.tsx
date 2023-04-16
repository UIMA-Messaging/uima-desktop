import '../styles/Settings.css'
import Page from '../components/Page'
import Input from '../components/Input'
import Button from '../components/Button'
import Sidebar from '../components/Sidebar'
import useAuth from '../hooks/use-auth'
import useAppData from '../hooks/use-app-data'
import { User } from '../../common/types'

export default () => {
	const { logout } = useAuth()
	const [profile, setProfile] = useAppData<User>('user.profile')

	return (
		<div className="app-container">
			<Sidebar />
			<Page title="Settings">
				<div className="settings-container">
					<Input
						label={
							<span>
								<b>Change profile picture </b> (max 4MB)
							</span>
						}
					>
						<div className="image-upload-container">
							{profile?.image ? <img className="image-display" src={profile?.image} /> : <div className="image-display" />}
							<Button type="green" label="Upload" onClick={() => document.getElementById('file').click()} />
							<input type="file" style={{ display: 'none' }} id="file" />
						</div>
					</Input>
					<Input
						label={
							<span>
								<b>How we identify you </b> (this cannot be modified)
							</span>
						}
						placeholder={profile?.username}
						disabled
					/>
					<Input label={<b>Your display name</b>} placeholder={profile?.displayName} />
					<span style={{ marginTop: '50px', display: 'flex', gap: '10px' }}>
						<Button label="Logout" onClick={logout} />
						<Button label="Save" type="green" />
						<Button label="Delete Account" type="red" />
					</span>
				</div>
			</Page>
		</div>
	)
}
