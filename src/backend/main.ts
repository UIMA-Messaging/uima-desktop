import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import ElectronStore from 'electron-store'
import Authentification from './services/authentication'
import EjabberdClient from './clients/ejabberdClient'
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

let window: BrowserWindow = null
app.whenReady().then(() => (window = createWindow()))

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())

const store = new ElectronStore()
const authentication = new Authentification(store)
const stateManagement = new StateManagement(store)
const ejabberd = new EjabberdClient('localhost', 5222)
ejabberd.setJabberUser('username1@localhost', '123')

export { authentication, stateManagement, ejabberd, window }

import './events/authEvents'
import './events/xmpEvents'
