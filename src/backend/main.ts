import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import ElectronStore from 'electron-store'
import Authentification from './services/authentication'
import EjabberdClient from './services/ejabberd'
import StateManagement from './services/stateManagement'
import './channels/dataHandlers'
import './channels/xmpHandlers'
import './channels/authHandlers'

require('electron-squirrel-startup') && app.quit()

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

let createdWindow: BrowserWindow = null
app.whenReady().then(() => (createdWindow = createWindow()))

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())

const store = new ElectronStore()
const authentication = new Authentification(store)
const stateManagement = new StateManagement(store)
const ejabberd = new EjabberdClient('username1@localhost', '123', 'localhost', 5222)

export { authentication, stateManagement, ejabberd, createdWindow }

import './events/authEvents'
import './events/xmpEvents'
