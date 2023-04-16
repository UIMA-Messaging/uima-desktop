import '../styles/Settings.css'
import Page from '../components/Page'
import Input from '../components/Input'
import Button from '../components/Button'
import Sidebar from '../components/Sidebar'

export default () => {
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
							<img className="image-display" />
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
						placeholder="username1#0001"
						disabled
					/>
					<Input label={<b>Your display name</b>} placeholder="Username1" />
					<span style={{ marginTop: '50px', display: 'flex', gap: '10px' }}>
						<Button label="Logout" />
						<Button label="Save" type="green" />
						<Button label="Delete Account" type="red" />
					</span>
				</div>
			</Page>
		</div>
	)
}
