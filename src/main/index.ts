import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import Authentification from './services/authentication'
import EjabberdClient from './clients/ejabberd-client'
import AppData from './repos/app-data'
import SqlConnection from './services/sql-connection'
import { Database } from 'sqlite3'
import MessageRepo from './repos/message-repo'
import ChannelRepo from './repos/channel-repo'
import ContactRepo from './repos/contact-repo'
import Encryption from './services/encryption'

require('electron-squirrel-startup') && app.quit()

// Window creation
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

function createWindow(): BrowserWindow {
	const window = new BrowserWindow({
		height: 600,
		width: 800,
		backgroundColor: 'black',
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	})
	window.removeMenu()
	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
	isDev && window.webContents.openDevTools({ mode: 'detach' })
	return window
}

// App behavior
let window: BrowserWindow = null
app.whenReady().then(() => (window = createWindow()))
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())
const connection = new SqlConnection(new Database('src/main.db'))

// Repositories
const appData = new AppData(connection)
const contacts = new ContactRepo(connection)
const channels = new ChannelRepo(connection)
const messages = new MessageRepo(connection)

// Services
const authentication = new Authentification(appData)

// Clients
const ejabberd = new EjabberdClient('localhost', 5222)

// Encryption
const encryption = new Encryption()

export { authentication, appData, ejabberd, connection, messages, channels, contacts, encryption, window }

// Register handlers
import './handlers/app-data-handlers'
import './handlers/xmp-handlers'
import './handlers/auth-handlers'
import './handlers/message-handlers'
import './handlers/contacts-handlers'

// Register events
import './events/auth-events'
import './events/xmp-events'
