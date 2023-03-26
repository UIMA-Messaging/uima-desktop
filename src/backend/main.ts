import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import ElectronStore from 'electron-store'
import Authentification from './services/authentication'
import EjabberdClient from './clients/ejabberdClient'
import StateManagement from './services/stateManagement'
import SqlConnection from './services/sqlConnection'
import { Database } from 'sqlite3'
import MessageRepo from './repos/messageRepo'
import ChannelRepo from './repos/channelRepo'
import UserRepo from './repos/userRepo'
import ContactManagament from './services/contactManagement'

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
  if (isDev) {
    window.webContents.openDevTools({ mode: 'detach' })
  }
  return window
}

// App behavior
let window: BrowserWindow = null
app.whenReady().then(() => (window = createWindow()))
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())

// Services
const store = new ElectronStore()
const authentication = new Authentification(store)
const stateManagement = new StateManagement(store)
const contactManagement = new ContactManagament()

// Repositories
const connection = new SqlConnection(new Database('main.db'))
const users = new UserRepo(connection)
const channels = new ChannelRepo(connection)
const messages = new MessageRepo(connection)

// Clients
const ejabberd = new EjabberdClient('localhost', 5222)

export { authentication, stateManagement, ejabberd, connection, messages, channels, users, contactManagement, window }

// Register handlers
import './handlers/dataHandlers'
import './handlers/xmpHandlers'
import './handlers/authHandlers'
import './handlers/messageHandlers'
import './handlers/contactHandlers'

// Register events
import './events/authEvents'
import './events/xmpEvents'
